'use strict';

var context;
var hostSite;
var hostWebUrl;
var appWebUrl;
var hostWeb;
var hostListCollection
var foundBanners = false;
var bannerListTitle;
var slideTime;
var transitionType;


$(document).ready(function () {
    jQuery.support.cors = true;
    checkConfiguration("");
});

function checkConfiguration(err) {
    if (err == "") {
        hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        appWebUrl = decodeURIComponent(getQueryStringParameter("SPappWebUrl"));

        context = SP.ClientContext.get_current();
        hostSite = new SP.AppContextSite(context, hostWebUrl);
        hostWeb = hostSite.get_web();
        hostListCollection = hostWeb.get_lists();
        context.load(hostSite);
        context.load(hostWeb);
        context.load(hostListCollection)
        context.executeQueryAsync(
			function () {
			    bannerListTitle = decodeURIComponent(getQueryStringParameter("BannerList"));
			    var listEnumerator = hostListCollection.getEnumerator();

			    while (listEnumerator.moveNext()) {
			        var currentList = listEnumerator.get_current();
			        if (currentList.get_title() == bannerListTitle) {
			            foundBanners = true;
			        }
			    }

			    renderUI(foundBanners);
			},
			function () {
			    $('#message').text('Failed to get host site objects');
			}
		);
    }
    else {
        $('#message').text(err);
    }
}
function renderUI(bannerExists) {
    if (foundBanners) {
        var bannerList = hostListCollection.getByTitle(bannerListTitle);

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("");
        var collListItem = bannerList.getItems(camlQuery);

        context.load(collListItem);
        context.executeQueryAsync(
			function () {
			    var listItemInfo = "";
			    var listItemEnumerator = collListItem.getEnumerator();

			    while (listItemEnumerator.moveNext()) {
			        var oListItem = listItemEnumerator.get_current();
			        listItemInfo +=
						'<img src="' + oListItem.get_item('Image').get_url() +
						 '" title="' + oListItem.get_item('Title') +
						   '" alt="' + oListItem.get_item('Description') + '" />';
			    }

			    $("#banner").append(listItemInfo);

			    getSlideOptions();

			    $('.slideshow').cycle({
			        fx: transitionType,
			        timeout: slideTime
			    });
			},
			function (sender, args) {
			    $('#message').text(args.get_message());
			}
		);
    }
    else {
        createBannerList(bannerListTitle);
    }
}
function createBannerList(bannerListTitle) {
    var bannerListCreationInfo = new SP.ListCreationInformation();
    bannerListCreationInfo.set_title(bannerListTitle);
    bannerListCreationInfo.set_templateType(SP.ListTemplateType.genericList);
    var bannersList = hostWeb.get_lists().add(bannerListCreationInfo);
    var bannersFields = bannersList.get_fields();
    var descriptionField = context.castTo(
					bannersFields.addFieldAsXml('<Field Type="Text" DisplayName="Description" Name="Description" />',
					true,
					SP.AddFieldOptions.addToDefaultContentType),
					SP.FieldText);
    var imageField = context.castTo(
					bannersFields.addFieldAsXml('<Field Type="URL" DisplayName="Image" Name="Image" />',
					true,
					SP.AddFieldOptions.addToDefaultContentType),
					SP.FieldUrl);
    var bannerItemInfo = new SP.ListItemCreationInformation();
    var bannerListItem = bannersList.addItem(bannerItemInfo);
    bannerListItem.set_item("Title", "Canada Flag");
    bannerListItem.set_item("Description", "The Canadian Flag");
    var urlValue = new SP.FieldUrlValue();
    urlValue.set_url("http://www.olstars.com/images/flags/Big/ca.gif");
    urlValue.set_description("The Canadian Flag");
    bannerListItem.set_item("Image", urlValue);
    bannerListItem.update();
    bannerListItem = bannersList.addItem(bannerItemInfo);
    bannerListItem.set_item("Title", "USA Flag");
    bannerListItem.set_item("Description", "Flag of United States");
    var urlValue = new SP.FieldUrlValue();
    urlValue.set_url("http://www.olstars.com/images/flags/Big/us.gif");
    urlValue.set_description(" Flag of United States");
    bannerListItem.set_item("Image", urlValue);
    bannerListItem.update();
    bannerListItem = bannersList.addItem(bannerItemInfo);
    bannerListItem.set_item("Title", "UK Flag");
    bannerListItem.set_item("Description", "Flag of United Kingdom");
    var urlValue = new SP.FieldUrlValue();
    urlValue.set_url("http://www.olstars.com/images/flags/Big/gb.gif");
    urlValue.set_description("Flag of United Kingdom");
    bannerListItem.set_item("Image", urlValue);
    bannerListItem.update();
    context.load(bannersList);
    context.executeQueryAsync(
		function () {
		    checkConfiguration("");
		},
		function (sender, args) {
		    checkConfiguration(args.get_message());
		}
	);
}
function getSlideOptions() {

    slideTime = decodeURIComponent(getQueryStringParameter("SlideTime"));
    if (slideTime > 0) {
        slideTime *= 1000;
    }
    else
        slideTime = 2000;

    var transitionTypeEnum = decodeURIComponent(getQueryStringParameter("TransitionType"));
    switch (transitionTypeEnum) {
        case "1": transitionType = "blindX"; break;
        case "2": transitionType = "blindY"; break;
        case "3": transitionType = "blindZ"; break;
        case "4": transitionType = "cover"; break;
        case "5": transitionType = "curtainX"; break;
        case "6": transitionType = "curtainY"; break;
        case "7": transitionType = "fade"; break;
        case "8": transitionType = "fadeZoom"; break;
        case "9": transitionType = "growX"; break;
        case "10": transitionType = "growY"; break;
        case "11": transitionType = "none"; break;
        case "12": transitionType = "scrollUp"; break;
        case "13": transitionType = "scrollDown"; break;
        case "14": transitionType = "scrollLeft"; break;
        case "15": transitionType = "scrollRight"; break;
        case "16": transitionType = "scrollHorz"; break;
        case "17": transitionType = "scrollVert"; break;
        case "18": transitionType = "shuffle"; break;
        case "19": transitionType = "slideX"; break;
        case "20": transitionType = "slideY"; break;
        case "21": transitionType = "toss"; break;
        case "22": transitionType = "turnUp"; break;
        case "23": transitionType = "turnDown"; break;
        case "24": transitionType = "turnLeft"; break;
        case "25": transitionType = "turnRight"; break;
        case "26": transitionType = "uncover"; break;
        case "27": transitionType = "wipe"; break;
        case "28": transitionType = "zoom"; break;
        default: transitionType = "turnUp"; break;
    };
}
function getQueryStringParameter(paramToRetrieve) {
    var params =
		document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}


(function () {



    $(document).ready(function () {

        //hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        //appWebUrl = decodeURIComponent(getQueryStringParameter("SPappWebUrl"));

        //var scriptbase = hostWebUrl + "/_layouts/15/";

        //$.getScript(scriptbase + "SP.Runtime.js",
        //function () { $.getScript(scriptbase + "SP.js",
        //                function () { $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest); }
        //              );
        //            }
        //);
    });

    function execCrossDomainRequest() {
        var appWebContext = new SP.ClientContext(appWebUrl);
        var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl.toLowerCase());
        appWebContext.set_webRequestExecutorFactory(factory);

        var hostSite = new SP.AppContextSite(appWebContext, hostWebUrl);
        hostListCollection = hostSite.get_web().get_lists();

        var bannerListTitle = decodeURIComponent(getQueryStringParameter("BannerList"));
        var bannerList = hostListCollection.getByTitle(bannerListTitle);

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("");
        var collListItem = bannerList.getItems(camlQuery);

        appWebContext.load(collListItem);

        appWebContext.executeQueryAsync(
			Function.createDelegate(this, onBannerSuccess),
			Function.createDelegate(this, onBannerFail));

        function onBannerSuccess() {
            var listItemInfo = "";
            var listItemEnumerator = collListItem.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                listItemInfo +=
					'<img src="' + oListItem.get_item('Image').get_url() +
					 '" title="' + oListItem.get_item('Title') +
					   '" alt="' + oListItem.get_item('Info') + '" />';
            }

            $("#banner").append(listItemInfo);

            getSlideOptions();

            $('.slideshow').cycle({
                fx: transitionType,
                timeout: slideTime
            });
        }

        function onBannerFail(sender, args) {
            $('#message').text('Banner Error: ' + args.get_message());
        }
    };



})();