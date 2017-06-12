/**********************************************************************************
 * $URL: https://source.etudes.org/svn/apps/account/trunk/account-webapp/webapp/src/java/org/etudes/account/cdp/AccountCdpHandler.java $
 * $Id: AccountCdpHandler.java 6574 2013-12-11 01:52:20Z ggolden $
 ***********************************************************************************
 *
 * Copyright (c) 2013 Etudes, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **********************************************************************************/

package org.etudes.account.cdp;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.etudes.api.app.jforum.JForumUserService;
import org.etudes.cdp.api.CdpHandler;
import org.etudes.cdp.api.CdpStatus;
import org.etudes.cdp.util.CdpResponseHelper;
import org.sakaiproject.component.cover.ComponentManager;
import org.sakaiproject.user.api.User;
import org.sakaiproject.user.api.UserAlreadyDefinedException;
import org.sakaiproject.user.api.UserDirectoryService;
import org.sakaiproject.user.api.UserEdit;
import org.sakaiproject.user.api.UserLockedException;
import org.sakaiproject.user.api.UserNotDefinedException;
import org.sakaiproject.user.api.UserPermissionException;
import org.sakaiproject.util.StringUtil;

/**
 */
public class AccountCdpHandler implements CdpHandler
{
	/**
	 * CdpParticipantStatus captures a user's relationship to the site.
	 */
	enum CdpParticipantStatus
	{
		active(3), blocked(1), dropped(2), enrolled(0), inactive(4);

		private final int sortOrder;

		private CdpParticipantStatus(int sortOrder)
		{
			this.sortOrder = Integer.valueOf(sortOrder);
		}

		public Integer getSortValue()
		{
			return sortOrder;
		}
	}

	class SiteMember
	{
		String aim = null;
		String avatar = null;
		String displayName = null;
		String eid = null;
		String email = null;
		String facebook = null;
		String firstName = null;
		String googlePlus = null;
		String hiddenEmail = null;
		String iid = null;
		boolean includeSig = false;
		String interests = null;
		String lastName = null;
		String linkedIn = null;
		String location = null;
		String msn = null;
		String occupation = null;

		String role = null;
		boolean showEmail = false;
		String sig = null;
		String skype = null;
		CdpParticipantStatus status;
		String twitter = null;
		String userId = null;
		String website = null;
		String yahoo = null;
	}

	/** Our log (commons). */
	private static Log M_log = LogFactory.getLog(AccountCdpHandler.class);

	public String getPrefix()
	{
		return "account";
	}

	public Map<String, Object> handle(HttpServletRequest req, HttpServletResponse res, Map<String, Object> parameters, String requestPath,
			String path, String authenticatedUserId) throws ServletException, IOException
	{
		// if no authenticated user, we reject all requests
		if (authenticatedUserId == null)
		{
			Map<String, Object> rv = new HashMap<String, Object>();
			rv.put(CdpStatus.CDP_STATUS, CdpStatus.notLoggedIn.getId());
			return rv;
		}

		else if (requestPath.equals("account"))
		{
			return dispatchAccount(req, res, parameters, path, authenticatedUserId);
		}
		else if (requestPath.equals("setAccount"))
		{
			return dispatchSetAccount(req, res, parameters, path, authenticatedUserId);
		}

		return null;
	}

	protected Map<String, Object> dispatchAccount(HttpServletRequest req, HttpServletResponse res, Map<String, Object> parameters, String path,
			String userId) throws ServletException, IOException
	{
		Map<String, Object> rv = new HashMap<String, Object>();

		// if not authenticated
		if (userId == null)
		{
			// add status parameter
			rv.put(CdpStatus.CDP_STATUS, CdpStatus.accessDenied.getId());
			return rv;
		}

		// build up a map to return - the main map has a single "account" object
		Map<String, String> accountMap = new HashMap<String, String>();
		rv.put("account", accountMap);

		loadAccount(accountMap, userId);

		// add status parameter
		rv.put(CdpStatus.CDP_STATUS, CdpStatus.success.getId());

		return rv;
	}

	protected Map<String, Object> dispatchSetAccount(HttpServletRequest req, HttpServletResponse res, Map<String, Object> parameters, String path,
			String userId) throws ServletException, IOException
	{
		Map<String, Object> rv = new HashMap<String, Object>();

		// if not authenticated
		if (userId == null)
		{
			// add status parameter
			rv.put(CdpStatus.CDP_STATUS, CdpStatus.accessDenied.getId());
			return rv;
		}

		// Note: fields are optional

		// get the avatar file
		FileItem avatar = null;
		Object o = parameters.get("avatar");
		if ((o != null) && (o instanceof FileItem))
		{
			avatar = (FileItem) o;
		}

		if ((avatar != null) && (avatar.getSize() > 0))
		{
			// make sure it is an image
			if (!avatar.getContentType().startsWith("image/"))
			{
				M_log.warn("dispatchSetAccount - avatar not image type: " + avatar.getContentType());

				// add status parameter
				rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
				return rv;
			}
		}

		String showEmailStr = (String) parameters.get("showEmail");
		String aim = (String) parameters.get("aim");
		String msn = (String) parameters.get("msn");
		String yahoo = (String) parameters.get("yahoo");
		String facebook = (String) parameters.get("facebook");
		String twitter = (String) parameters.get("twitter");
		String website = (String) parameters.get("website");
		String location = (String) parameters.get("location");
		String occupation = (String) parameters.get("occupation");
		String interests = (String) parameters.get("interests");
		String email = (String) parameters.get("email");
		String pw = (String) parameters.get("pw");
		String clear = (String) parameters.get("clear");
		String skype = (String) parameters.get("skype");
		String googlePlus = (String) parameters.get("googlePlus");
		String linkedIn = (String) parameters.get("linkedIn");
		String firstName = (String) parameters.get("firstName");
		String lastName = (String) parameters.get("lastName");

		// ignore if the user is not allowed to change name
		if (!userDirectoryService().allowUpdateUserName(userId))
		{
			firstName = null;
			lastName = null;
		}

		// sig is html, but JForum will take care of cleaning it
		String sig = (String) parameters.get("sig");
		// String sigChanged = (String) parameters.get("sigChanged");
		// // TODO: use sigChanged...

		String includeSigStr = (String) parameters.get("includeSig");

		// get the user record from jforum which holds most of this
		org.etudes.api.app.jforum.User u = jForumUserService().getBySakaiUserId(userId);
		if (u == null)
		{
			M_log.warn("dispatchSetAccount - no jforum user record: " + userId);

			// add status parameter
			rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
			return rv;
		}

		// update the user's avatar
		if ((clear != null) && (clear.equals("1")))
		{
			// clear the avatar
			u.setAvatar(null);
		}
		else if ((avatar != null) && (avatar.getSize() > 0))
		{
			u.attachAvatar(avatar.getName(), avatar.get());
		}

		// show email
		if (showEmailStr != null)
		{
			u.setViewEmailEnabled(showEmailStr.equals("1"));
		}

		// include sig
		if (includeSigStr != null)
		{
			u.setAttachSignatureEnabled(includeSigStr.equals("1"));
		}

		// sig
		if (sig != null)
		{
			if (sig.length() == 0) sig = null;
			u.setSignature(sig);
		}

		// aim
		if (aim != null)
		{
			u.setAim(aim);
		}

		// msn
		if (msn != null)
		{
			u.setMsnm(msn);
		}

		// yahoo
		if (yahoo != null)
		{
			u.setYim(yahoo);
		}

		// facebook
		if (facebook != null)
		{
			u.setFaceBookAccount(facebook);
		}

		// twitter
		if (twitter != null)
		{
			u.setTwitterAccount(twitter);
		}

		// website
		if (website != null)
		{
			u.setWebSite(website);
		}

		// location
		if (location != null)
		{
			u.setFrom(location);
		}

		// occupation
		if (occupation != null)
		{
			u.setOccupation(occupation);
		}

		// interests
		if (interests != null)
		{
			u.setInterests(interests);
		}

		if (skype != null)
		{
			u.setSkype(skype);
		}

		if (googlePlus != null)
		{
			u.setGooglePlus(googlePlus);
		}

		if (linkedIn != null)
		{
			u.setLinkedIn(linkedIn);
		}

		// and save
		jForumUserService().modifyUser(u);

		// email & pw & name
		if ((email != null) || (pw != null) || (firstName != null) || (lastName != null))
		{
			try
			{
				UserEdit user = userDirectoryService().editUser(userId);

				if (email != null)
				{
					user.setEmail(email);
				}

				if (pw != null)
				{
					user.setPassword(pw);
				}

				if (firstName != null)
				{
					user.setFirstName(firstName);
				}

				if (lastName != null)
				{
					user.setLastName(lastName);
				}

				userDirectoryService().commitEdit(user);
			}
			catch (UserNotDefinedException e)
			{
				M_log.warn("dispatchSetAccount - no user record: " + userId);

				// add status parameter
				rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
				return rv;
			}
			catch (UserPermissionException e)
			{
				M_log.warn("dispatchSetAccount - on user record: " + userId + " : " + e);

				// add status parameter
				rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
				return rv;
			}
			catch (UserLockedException e)
			{
				M_log.warn("dispatchSetAccount - on user record: " + userId + " : " + e);

				// add status parameter
				rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
				return rv;
			}
			catch (UserAlreadyDefinedException e)
			{
				M_log.warn("dispatchSetAccount - on user record: " + userId + " : " + e);

				// add status parameter
				rv.put(CdpStatus.CDP_STATUS, CdpStatus.badRequest.getId());
				return rv;
			}
		}

		// return the "account" request details

		// build up a map to return - the main map has a single "account" object
		Map<String, String> accountMap = new HashMap<String, String>();
		rv.put("account", accountMap);

		loadAccount(accountMap, userId);

		// add status parameter
		rv.put(CdpStatus.CDP_STATUS, CdpStatus.success.getId());

		return rv;
	}

	/**
	 * @return The UserDirectoryService, via the component manager.
	 */
	protected UserDirectoryService userDirectoryService()
	{
		return (UserDirectoryService) ComponentManager.get(UserDirectoryService.class);
	}

	/**
	 * @return The JForumUserService, via the component manager.
	 */
	protected JForumUserService jForumUserService()
	{
		return (JForumUserService) ComponentManager.get(JForumUserService.class);
	}

	/**
	 * Get a user's account information
	 * 
	 * @param userId
	 *        The user id.
	 * @return The user's account information.
	 */
	protected SiteMember getMember(String userId)
	{
		SiteMember p = new SiteMember();
		try
		{
			p.userId = userId;

			User user = userDirectoryService().getUser(p.userId);
			p.displayName = user.getSortName();
			p.firstName = user.getFirstName();
			p.lastName = user.getLastName();
			p.email = user.getEmail();
			p.hiddenEmail = p.email;
			p.eid = user.getEid();

			// get the JForum user profile
			org.etudes.api.app.jforum.User u = jForumUserService().getBySakaiUserId(p.userId);
			if (u != null)
			{
				p.showEmail = u.isViewEmailEnabled();
				if (!p.showEmail) p.email = null;
				p.avatar = StringUtil.trimToNull(u.getAvatar());
				p.website = StringUtil.trimToNull(u.getWebSite());
				p.aim = StringUtil.trimToNull(u.getAim());
				p.msn = StringUtil.trimToNull(u.getMsnm());
				p.yahoo = StringUtil.trimToNull(u.getYim());
				p.facebook = StringUtil.trimToNull(u.getFaceBookAccount());
				p.twitter = StringUtil.trimToNull(u.getTwitterAccount());
				p.occupation = StringUtil.trimToNull(u.getOccupation());
				p.interests = StringUtil.trimToNull(u.getInterests());
				p.location = StringUtil.trimToNull(u.getFrom());
				p.sig = StringUtil.trimToNull(u.getSignature());
				p.includeSig = u.getAttachSignatureEnabled();
				p.googlePlus = StringUtil.trimToNull(u.getGooglePlus());
				p.linkedIn = StringUtil.trimToNull(u.getLinkedIn());
				p.skype = StringUtil.trimToNull(u.getSkype());
			}
		}
		catch (UserNotDefinedException e)
		{
			M_log.warn("getMember: missing user: " + userId);
		}

		return p;
	}

	/**
	 * Load up user account details into the accountMap.
	 * 
	 * @param accountMap
	 *        The map to hold the details.
	 * @param userId
	 *        The user id.
	 */
	protected void loadAccount(Map<String, String> accountMap, String userId)
	{
		SiteMember m = getMember(userId);

		accountMap.put("userId", m.userId);
		accountMap.put("displayName", m.displayName);
		accountMap.put("firstName", m.firstName);
		accountMap.put("lastName", m.lastName);
		accountMap.put("showEmail", CdpResponseHelper.formatBoolean(m.showEmail));
		accountMap.put("mutableName", CdpResponseHelper.formatBoolean(userDirectoryService().allowUpdateUserName(userId)));

		String email = StringUtil.trimToNull(m.hiddenEmail);
		if (email != null) accountMap.put("email", email);

		if (m.avatar != null)
		{
			String avatarPath = "/cdp/doc/avatar/" + m.avatar;
			accountMap.put("avatar", avatarPath);
		}

		if (m.website != null) accountMap.put("website", m.website);
		if (m.msn != null) accountMap.put("msn", m.msn);
		if (m.yahoo != null) accountMap.put("yahoo", m.yahoo);
		if (m.facebook != null) accountMap.put("facebook", m.facebook);
		if (m.twitter != null) accountMap.put("twitter", m.twitter);
		if (m.occupation != null) accountMap.put("occupation", m.occupation);
		if (m.interests != null) accountMap.put("interests", m.interests);
		if (m.aim != null) accountMap.put("aim", m.aim);
		if (m.location != null) accountMap.put("location", m.location);
		if (m.iid != null) accountMap.put("iid", m.iid);
		if (m.sig != null) accountMap.put("sig", m.sig);
		if (m.googlePlus != null) accountMap.put("googlePlus", m.googlePlus);
		if (m.skype != null) accountMap.put("skype", m.skype);
		if (m.linkedIn != null) accountMap.put("linkedIn", m.linkedIn);

		accountMap.put("includeSig", CdpResponseHelper.formatBoolean(m.includeSig));
		accountMap.put("eid", m.eid);
	}
}
