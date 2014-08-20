'use strict';

var context;
var hostWeb;
var hostListCollection;
var bannersList;
var bannerListTitle;
var slideTime;
var transitionType;

$(document).ready(function () {
    jQuery.support.cors = true;

	var PARAM_BANNERLIST = "BannerList";
	var PARAM_SPHOSTURL = "SPHostUrl";
	var PARAM_SPAPPWebUrl = "SPAppWebUrl";

	var hostWebUrl = decodeURIComponent(getQueryStringParameter(PARAM_SPHOSTURL));
	bannerListTitle = decodeURIComponent(getQueryStringParameter(PARAM_BANNERLIST));

	context = SP.ClientContext.get_current();

	var hostSite = new SP.AppContextSite(context, hostWebUrl);
	hostWeb = hostSite.get_web();
	hostListCollection = hostWeb.get_lists();

	context.load(hostSite);
	context.load(hostWeb);
	context.load(hostListCollection)

	context.executeQueryAsync(
		function () {
		    if (!checkBannerListExists(bannerListTitle)) {
		        createBannerList(bannerListTitle);
		        addExampleItems();
		    }

		    renderUI();
		},
		function (sender, args) {
		    $('#message').text(args.get_message());
		}
	);
});

function checkBannerListExists(bannerListTitle)
{
    var foundBanners = false;
    var listEnumerator = hostListCollection.getEnumerator();

    while (listEnumerator.moveNext()) {
        var currentList = listEnumerator.get_current();
        if (currentList.get_title() == bannerListTitle) {
            foundBanners = true;
            break;
        }
    }

    return foundBanners;
}

function createBannerList(bannerListTitle) {
	var bannerListCreationInfo = new SP.ListCreationInformation();
	bannerListCreationInfo.set_title(bannerListTitle);
	bannerListCreationInfo.set_templateType(SP.ListTemplateType.genericList);
	bannersList = hostWeb.get_lists().add(bannerListCreationInfo);

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

	context.load(bannersList);
}

function addExampleItems()
{
    addBannerToList("Canada Flag", "The Canadian Flag", "http://www.olstars.com/images/flags/Big/ca.gif")
    addBannerToList("USA Flag", "Flag of United States", "http://www.olstars.com/images/flags/Big/us.gif")
    addBannerToList("UK Flag", "Flag of United Kingdom", "http://www.olstars.com/images/flags/Big/gb.gif")
}

function addBannerToList(title, description, imageUrl)
{
	var bannerItemInfo = new SP.ListItemCreationInformation();
	var bannerListItem = bannersList.addItem(bannerItemInfo);
	bannerListItem.set_item("Title", title);
	bannerListItem.set_item("Description", description);
	var urlValue = new SP.FieldUrlValue();
	urlValue.set_url(imageUrl);
	urlValue.set_description(description);
	bannerListItem.set_item("Image", urlValue);
	bannerListItem.update();
}

function renderUI() {
    bannersList = hostListCollection.getByTitle(bannerListTitle);

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml("");
    var collListItems = bannersList.getItems(camlQuery);

    context.load(collListItems);
    context.executeQueryAsync(
		function () {
		    var listItemInfo = "";
		    var listItemEnumerator = collListItems.getEnumerator();

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
	    default: transitionType = "fade"; break;
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