tool_obj =
{
	testMode: false,

	title: "ACCOUNT",

	account: null,

	sigEditor : null,

	sigEditorConfig:
	{
		skin: 'office2003',
		disableNativeSpellChecker: false,
		browserContextMenuOnCtrl: true,
	    toolbar_Basic:
		[
			['Source'],
			['Undo', 'Redo'],
			['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'TextColor', 'BGColor'],
			['Link', 'Image', 'Smiley', 'SpecialChar'],
			['RemoveFormat']
		],
        toolbar_Full:
		[
			[ 'Source','-','DocProps','Print','-'] ,
			[ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] ,
			[ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] ,
			[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] ,
			[ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote',
			'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] ,
			[ 'Link','Unlink','Anchor'] ,
			[ 'Image','MediaEmbed','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'] ,
			[ 'Maximize', 'ShowBlocks'] ,
			[ 'TextColor','BGColor' ] ,
			[ 'Styles','Format','Font','FontSize' ] 
		],
		toolbar: 'Full',
		removePlugins: 'elementspath',
		resize_enabled: false,
		toolbarCanCollapse : false,
		height: 150,
        filebrowserBrowseUrl: '/ckfinder/ckfinder/ckfinder.html?type=Files',
    	filebrowserImageBrowseUrl: '/ckfinder/ckfinder/ckfinder.html?type=Images',
    	filebrowserFlashBrowseUrl: '/ckfinder/ckfinder/ckfinder.html?type=Flash',
    	removeDialogTabs: 'image:Link;flash:Link',
    	extraPlugins: 'MediaEmbed',
		scayt_srcUrl: "https://spell.etudes.org/spellcheck/lf/scayt/scayt.js",
		wsc_customLoaderScript: "https://spell.etudes.org/spellcheck/lf/22/js/wsc_fck2plugin.js",
		smiley_path: '/docs/smilies/',
		smiley_images: ['Straight-Face.png','Sun.png','Sweating.png','Thinking.png','Tongue.png',
									'Vomit.png','Wave.png','Whew.png','Win.png','Winking.png','Yawn.png','Yawn2.png',
									'Zombie.png','Angry.png','Balloon.png','Big-Grin.png','Bomb.png','Broken-Heart.png',
									'Cake.png','Cat.png','Clock.png','Clown.png','Cold.png','Confused.png','Cool.png',
									'Crying.png','Crying2.png','Dead.png','Devil.png','Dizzy.png','Dog.png',
									'Don\'t-tell-Anyone.png','Drinks.png','Drooling.png','Flower.png','Ghost.png','Gift.png',
									'Girl.png','Goodbye.png','Heart.png','Hug.png','Kiss.png','Laughing.png','Ligthbulb.png',
									'Loser.png','Love.png','Mail.png','Music.png','Nerd.png','Night.png','Ninja.png',
									'Not-Talking.png','on-the-Phone.png','Party.png','Pig.png','Poo.png','Rainbow.png',
									'Rainning.png','Sacred.png','Sad.png','Scared.png','Sick.png','Sick2.png','Silly.png',
									'Sleeping.png','Sleeping2.png','Sleepy.png','Sleepy2.png','smile.png','Smoking.png','Smug.png','Stars.png'],
		smiley_descriptions: ['Straight Face','Sun','Sweating','Thinking','Tongue',
									'Vomit','Wave','Whew','Win','Winking','Yawn','Yawn2',
									'Zombie','Angry','Balloon','Big Grin','Bomb','Broken Heart',
									'Cake','Cat','Clock','Clown','Cold','Confused','Cool',
									'Crying','Crying2','Dead','Devil','Dizzy','Dog',
									'Don\'t-tell-Anyone','Drinks','Drooling','Flower','Ghost','Gift',
									'Girl','Goodbye','Heart','Hug','Kiss','Laughing','Lightbulb',
									'Loser','Love','Mail','Music','Nerd','Night','Ninja',
									'Not Talking','On The Phone','Party','Pig','Poo','Rainbow',
									'Raining','Sacred','Sad','Scared','Sick','Sick2','Silly',
									'Sleeping','Sleeping2','Sleepy','Sleepy2','smile','Smoking','Smug','Stars'],								
		smiley_columns: 9
	},		

	start: function(obj, data)
	{
		setTitle(obj.title);

		setupDialog("account_name_dialog", "Done", function(){return obj.saveName(obj);});
		$("#account_name_link").unbind("click").click(function(){obj.editName(obj);return false;});

		setupDialog("account_password_dialog", "Done", function(){return obj.savePassword(obj);});
		$("#account_password_link").unbind("click").click(function(){obj.editPassword(obj);return false;});
		setupDialog("account_contact_dialog", "Done", function(){return obj.saveContact(obj);});
		$("#account_contact_link").unbind("click").click(function(){obj.editContact(obj);return false;});
		setupDialog("account_profile_dialog", "Done", function(){return obj.saveProfile(obj);});
		$("#account_profile_link").unbind("click").click(function(){obj.editProfile(obj);return false;});
		setupDialog("account_email_dialog", "Done", function(){return obj.saveEmail(obj);});
		$("#account_email_link").unbind("click").click(function(){obj.editEmail(obj);return false;});			
		setupDialog("account_avatar_dialog", "Done", function(){return obj.saveAvatar(obj);});
		$("#account_avatar_link").unbind("click").click(function(){obj.editAvatar(obj);return false;});
		setupDialog("account_signature_dialog", "Done", function(){return obj.saveSignature(obj);});
		$("#account_signature_link").unbind("click").click(function(){obj.editSignature(obj);return false;});
		setupAlert("account_alertNoSave_1");
		setupAlert("account_alertNoSave_2");
		setupAlert("account_alertNoSave_3");
		setupAlert("account_alertAvatarImage");
		$("#account_linkedin_help").unbind("click").click(function(){openAlert("account_alertLinked_help");return false;});
		$("#account_facebook_help").unbind("click").click(function(){openAlert("account_alertFacebook_help");return false;});
		
		$('#account_contact_dialog_linkedin').unbind('change').change(function(){obj.validateLinkedin(obj); return true;});
		$('#account_contact_dialog_facebook').unbind('change').change(function(){obj.validateFacebook(obj); return true;});

		// use a direct form for the avatar dialog because of the file upload and stupid IE
		setupForm("account_avatar_dialog_upload_form", "account_setAccount", function(response){obj.loadAccountView(obj, response.account);});
		$("#account_avatar_dialog_upload").on('change', function(event){obj.acceptAvatarSelect(obj);});
		$("#account_avatar_dialog_clear").on('change', function(event){obj.acceptAvatarClear(obj);});

		var editor = CKEDITOR.appendTo('account_signature_dialog_sig', obj.sigEditorConfig, '');
		
		CKEDITOR.on('instanceReady', function(ev)
		{
			for (var tag in CKEDITOR.dtd)
			{
				if (tag.substring(0,1) == '$') continue;
					ev.editor.dataProcessor.writer.setRules(tag,
					{
						indent : false,
						breakBeforeOpen : false,
						breakAfterOpen : false,
						breakBeforeClose : false,
						breakAfterClose : false
					});
				}
			});
 
			if (obj.testMode == true)
			{
				$("#account_signature_sig_send_tmp").unbind("click").click(function(){obj.tmpSend(obj);return false;});
		}
		else
		{
			$("#account_signature_sig_send_tmp").addClass("e3_offstage");
			$("#account_signature_sig_tmp").addClass("e3_offstage");
		}

		obj.sigEditor = editor;

		obj.loadAccount(obj);
		
		startHeartbeat();
	},

	tmpSend: function(obj)
	{
		var data = new Object();
		data.sig = $("#account_signature_sig_tmp").val();
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});
		return true;
	},

	stop: function(obj, save)
	{
		stopHeartbeat();
	},
	
	loadAccount: function(obj)
	{
		requestCdp("account_account", null, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});
	},

	loadAccountView: function(obj, accountData)
	{
		obj.account = accountData;

		if (obj.account.mutableName == "1")
		{
			$("#account_name_link").removeClass("e3_offstage");
			$("#account_name_official").addClass("e3_offstage");
		}
		else
		{
			$("#account_name_link").addClass("e3_offstage");
			$("#account_name_official").removeClass("e3_offstage");
		}

		$("#account_name_first").empty().text(obj.account.firstName);
		$("#account_name_last").empty().text(obj.account.lastName);
		
		$("#account_eid").empty().text(obj.account.eid);
		
		if (obj.account.avatar != undefined)
		{
			$("#account_avatar").css("width", "128px").css("height", "auto");
			$("#account_avatar").attr("src", obj.account.avatar).off('load').on('load', adjustForNewHeight);
			$("#account_avatar_none").addClass("e3_offstage");
			$("#account_avatar").removeClass("e3_offstage");
		}
		else
		{
			$("#account_avatar_none").removeClass("e3_offstage");
			$("#account_avatar").addClass("e3_offstage");
		}
		
		$("#account_email_email").empty().text(obj.account.email);
		$("#account_email_show_email").empty().text((obj.account.showEmail == "1" ? "YES" : "NO"));
		
		$("#account_signature_sig").empty().html(obj.account.sig);
		if (obj.testMode == true) $("#account_signature_sig_tmp").val(obj.account.sig);
		$("#account_signature_include_sig").empty().text((obj.account.includeSig == "1" ? "YES" : "NO"));

		$("#account_contact_aim").empty().text(obj.account.aim);
		$("#account_contact_msn").empty().text(obj.account.msn);
		$("#account_contact_yahoo").empty().text(obj.account.yahoo);
		$("#account_contact_skype").empty().text(obj.account.skype);
		$("#account_contact_googleplus").empty().text(obj.account.googlePlus);
		$("#account_contact_linkedin").empty().text(obj.account.linkedIn);
		$("#account_contact_facebook").empty().text(obj.account.facebook);
		$("#account_contact_twitter").empty().text(obj.account.twitter);
		$("#account_contact_website").empty().text(obj.account.website);

		$("#account_profile_location").empty().text(obj.account.location);
		$("#account_profile_occupation").empty().text(obj.account.occupation);
		$("#account_profile_interests").empty().text(obj.account.interests);
	},

	editName: function(obj)
	{
		$('#account_name_firstName').val(obj.account.firstName);
		$('#account_name_lastName').val(obj.account.lastName);

		$("#account_name_dialog").dialog('open');
	},

	saveName: function(obj)
	{
		var data = new Object();
		data.firstName = $.trim($('#account_name_firstName').val());
		data.lastName = $.trim($('#account_name_lastName').val());
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});

		return true;
	},

	passwordsValid: 0,

	editPassword: function(obj)
	{
		obj.passwordsValid = 0;
		$('#account_password_1').val(null);
		$('#account_password_2').val(null);
		$('#account_password_1').unbind('change').change(function(){obj.validatePasswords(obj);return true;});
		$('#account_password_2').unbind('change').change(function(){obj.validatePasswords(obj);return true;});
		$("#account_password_alert").addClass("e3_offstage");
		$("#account_password_alert2").addClass("e3_offstage");
		$("#account_password_alert3").addClass("e3_offstage");

		$("#account_password_dialog").dialog('open');
	},
	
	validatePasswords: function(obj)
	{
		var p1 = $.trim($('#account_password_1').val());
		var p2 = $.trim($('#account_password_2').val());
		$("#account_password_alert").addClass("e3_offstage");
		$("#account_password_alert2").addClass("e3_offstage");
		$("#account_password_alert3").addClass("e3_offstage");
		if (p1 != p2)
		{
			$("#account_password_alert").removeClass("e3_offstage");
			obj.passwordsValid = 2;
		}
		else if (p1.length == 0)
		{
			$("#account_password_alert2").removeClass("e3_offstage");
			obj.passwordsValid = 1;
		}
		else if (!obj.strongPassword(obj, p1))
		{
			$("#account_password_alert3").removeClass("e3_offstage");
			obj.passwordsValid = 3;
		}
		else
		{
			obj.passwordsValid = 0;
		}
	},

	strongPassword: function(obj, pw)
	{
		if (pw.length < 8) return false;
		if (-1 == pw.search("[A-Z]")) return false;
		if (-1 == pw.search("[a-z]")) return false;
		if (-1 == pw.search("[0-9]")) return false;

		return true;
	},

	savePassword: function(obj)
	{
		// if not valid...
		obj.validatePasswords(obj);
		if (obj.passwordsValid != 0)
		{
			$("#account_alertNoSave_" + obj.passwordsValid).dialog("open");
			return false;
		}

		var data = new Object();
		data.pw = $.trim($('#account_password_1').val());
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});

		return true;
	},

	editContact: function(obj)
	{	
		$("#account_contact_dialog_aim").attr('value', obj.account.aim);
		$("#account_contact_dialog_msn").attr('value', obj.account.msn);
		$("#account_contact_dialog_yahoo").attr('value', obj.account.yahoo);
		$("#account_contact_dialog_skype").attr('value', obj.account.skype);
		$("#account_contact_dialog_googleplus").attr('value', obj.account.googlePlus);
		$("#account_contact_dialog_linkedin").attr('value', obj.account.linkedIn);
		$("#account_contact_dialog_facebook").attr('value', obj.account.facebook);
		$("#account_contact_dialog_twitter").attr('value', obj.account.twitter);
		$("#account_contact_dialog_website").attr('value', obj.account.website);

		$("#account_contact_dialog").dialog('open');
	},
	
	saveContact: function(obj)
	{
		var data = new Object();
		data.aim = $("#account_contact_dialog_aim").val();
		data.msn = $("#account_contact_dialog_msn").val();
		data.yahoo = $("#account_contact_dialog_yahoo").val();
		data.skype = $("#account_contact_dialog_skype").val();
		data.googlePlus = $("#account_contact_dialog_googleplus").val();
		data.linkedIn = obj.extractLinkedinId(obj, $("#account_contact_dialog_linkedin").val());
		data.facebook = obj.extractFacebook(obj, $("#account_contact_dialog_facebook").val());
		data.twitter = $("#account_contact_dialog_twitter").val();
		data.website = $("#account_contact_dialog_website").val();
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});

		return true;
	},

	extractLinkedinId: function(obj, url)
	{
		var index = url.toLowerCase().indexOf("www.linkedin.com/in/");
		if (index == -1) return $.trim(url).toLowerCase();
		return $.trim(url.substring(index + "www.linkedin.com/in/".length)).toLowerCase();
	},

	validateLinkedin: function(obj)
	{
		 $("#account_contact_dialog_linkedin").val(obj.extractLinkedinId(obj, $("#account_contact_dialog_linkedin").val()));
	},

	extractFacebook: function(obj, url)
	{
		var index = url.toLowerCase().indexOf("facebook.com/");
		if (index == -1) return $.trim(url).toLowerCase();
		return $.trim(url.substring(index + "facebook.com/".length)).toLowerCase();
	},

	validateFacebook: function(obj)
	{
		 $("#account_contact_dialog_facebook").val(obj.extractFacebook(obj, $("#account_contact_dialog_facebook").val()));
	},

	editProfile: function(obj)
	{
		$("#account_profile_dialog_location").attr('value', obj.account.location);
		$("#account_profile_dialog_occupation").attr('value', obj.account.occupation);
		$("#account_profile_dialog_interests").attr('value', obj.account.interests);

		$("#account_profile_dialog").dialog('open');
	},
	
	saveProfile: function(obj)
	{
		var data = new Object();
		data.location = $("#account_profile_dialog_location").val();
		data.occupation = $("#account_profile_dialog_occupation").val();
		data.interests = $("#account_profile_dialog_interests").val();
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});
		return true;
	},

	editEmail: function(obj)
	{
		$("#account_email_dialog_email").attr('value', obj.account.email);
		if (obj.account.showEmail == "1")
		{
			$("#account_email_dialog_show_email").prop('checked', true);
		}
		else
		{
			$("#account_email_dialog_show_email").prop('checked', false);
		}

		$("#account_email_dialog").dialog('open');
	},
	
	saveEmail: function(obj)
	{
		var data = new Object();
		data.email = $("#account_email_dialog_email").val();
		data.showEmail = $("#account_email_dialog_show_email").is(':checked') ? "1" : "0";
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});
		return true;
	},

	editSignature: function(obj)
	{
		obj.sigEditor.setData(obj.account.sig);
		
		// FF mac and Opera Mac bug: setData() sets the dirty flag, but we need to reset it a moment later, else the reset is not effective -ggolden
		setTimeout(function(){obj.sigEditor.resetDirty();}, 100);

		if (obj.account.includeSig == "1")
		{
			$("#account_signature_dialog_include_sig").prop('checked', true);
		}
		else
		{
			$("#account_signature_dialog_include_sig").prop('checked', false);
		}

		$("#account_signature_dialog").dialog('open');
	},
	
	saveSignature: function(obj)
	{
		var data = new Object();
		data.sigChanged = obj.sigEditor.checkDirty() ? "1" : "0";
		data.sig = obj.sigEditor.getData();
		data.includeSig = $("#account_signature_dialog_include_sig").is(':checked') ? "1" : "0";
		requestCdp("account_setAccount", data, function(data)
		{
			obj.loadAccountView(obj, data.account);
		});
		return true;
	},

	avatarEditNewFile: null,
	avatarClear: false,

	editAvatar: function(obj)
	{
		obj.clearAvatarInputs(obj);
		$("#account_avatar_dialog_clear").prop('checked', false);
		obj.avatarEditNewFile = null;
		obj.avatarClear = false;
		obj.setupAvatarDialog(obj);
		$("#account_avatar_dialog").dialog('open');
	},
	
	setupAvatarDialog: function(obj)
	{
		// show the new selection (local file)
		if (obj.avatarEditNewFile != null)
		{
			// TODO: test for a FileReader
			// if (window.FileReader == undefined) alert("no window.FileReader");
			reader = new FileReader();
			reader.onloadend = function(e)
			{
				$("#account_avatar_dialog_preview").prop('src', e.target.result);
				$("#account_avatar_dialog_preview").removeClass("e3_offstage");
				$("#account_avatar_dialog_none").addClass("e3_offstage");
			};
			reader.readAsDataURL(obj.avatarEditNewFile);
		}
		
		// a selection of a local file was made, but we don't have support to show it
		else if ($("#account_avatar_dialog_upload").val().length > 0)
		{

		}
		
		// show the current avatar (unless set to be removed)
		else if ((obj.account.avatar != undefined) && (obj.avatarClear == false))
		{
			$("#account_avatar_dialog_preview").attr("src", obj.account.avatar);
			$("#account_avatar_dialog_preview").removeClass("e3_offstage");
			$("#account_avatar_dialog_none").addClass("e3_offstage");
		}

		// show no avatar selected
		else
		{
			$("#account_avatar_dialog_none").removeClass("e3_offstage");
			$("#account_avatar_dialog_preview").addClass("e3_offstage");
		}
		
		// if there is something to clear
		if ((obj.avatarEditNewFile != null) || ($("#account_avatar_dialog_upload").val().length > 0) || (obj.account.avatar != undefined))
		{
			$("#account_avatar_dialog_clear_holder").removeClass("e3_offstage");				
		}
		else
		{
			$("#account_avatar_dialog_clear_holder").addClass("e3_offstage");
		}
	},

	// clear the avatar dialog's file upload input
	clearAvatarInputs: function(obj)
	{
		$("#account_avatar_dialog_upload_holder").html($("#account_avatar_dialog_upload_holder").html());
		$("#account_avatar_dialog_upload").on('change', function(event){obj.acceptAvatarSelect(obj);});
	},

	acceptAvatarSelect: function(obj)
	{
		var fl = $("#account_avatar_dialog_upload").prop("files");
		if (fl != null)
		{
			obj.avatarEditNewFile = fl[0];				
		}
		else
		{
			// no support for Files - bad IE
		}

		obj.avatarClear = false;
		$("#account_avatar_dialog_clear").prop('checked', false);
		obj.validateAvatarSelection(obj);
		obj.setupAvatarDialog(obj);
	},

	acceptAvatarClear: function(obj)
	{
		obj.avatarClear = $('#account_avatar_dialog_clear').is(':checked');
		if (obj.avatarClear == true)
		{
			obj.avatarEditNewFile = null;
			obj.clearAvatarInputs(obj);				
		}

		obj.setupAvatarDialog(obj);
	},

	validateAvatarSelection: function(obj)
	{
		if (obj.avatarEditNewFile != null)
		{
			if (!((obj.avatarEditNewFile.type == "image/png") || (obj.avatarEditNewFile.type == "image/jpeg") || (obj.avatarEditNewFile.type == "image/gif")))
			{
				$("#account_alertAvatarImage").dialog("open");
				obj.avatarEditNewFile = null;
				obj.clearAvatarInputs(obj);
			}
		}
	},

	saveAvatar: function(obj)
	{
		// show loading
		$("#account_avatar").css("width", "100px").css("height", "100px");
		$("#account_avatar").attr("src", "/e3/support/icons/loading.gif").off('load').on('load', adjustForNewHeight);
		$("#account_avatar_none").addClass("e3_offstage");
		$("#account_avatar").removeClass("e3_offstage");

		// directly submit the form
		$("#account_avatar_dialog_upload_form").submit();

//			if ((obj.avatarEditNewFile != null) || (obj.avatarClear == true))
//			{
//				var data = new Object();
//				if (obj.avatarEditNewFile != null) data.avatar = obj.avatarEditNewFile;
//				data.clear = obj.avatarClear ? "1" : "0";
//				requestCdp("account_setAccount", data, function(data)
//				{
//					obj.loadAccountView(obj, data.account);
//				});
//			}

		return true;
	}
};

completeToolLoad();
