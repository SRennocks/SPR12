<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
	<title></title>

	<script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.js"></script>
	<script type="text/javascript" src="https://2020Solutions.sharepoint.com/siteassets/banner/scripts/jquery.cycle.all.js"></script>

	<script type="text/javascript" src="../Scripts/App.js"></script>
	<link rel="Stylesheet" type="text/css" href="../Content/App.css" />
</head>

	<body class="clientwebpart-body">
		<p id="message"></p>
		<div id="banner" class="slideshow"></div>
	</body>
</html>
