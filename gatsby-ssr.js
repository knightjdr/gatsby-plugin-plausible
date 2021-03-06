"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var getOptions = function getOptions(pluginOptions) {
  var plausibleDomain = pluginOptions.customDomain || 'plausible.io';
  var scriptURI = '/js/plausible.js';
  var domain = pluginOptions.domain;
  var excludePaths = pluginOptions.excludePaths || [];
  var trackAcquisition = pluginOptions.trackAcquisition || false;
  return {
    plausibleDomain: plausibleDomain,
    scriptURI: scriptURI,
    domain: domain,
    excludePaths: excludePaths,
    trackAcquisition: trackAcquisition
  };
};

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;

  if (process.env.NODE_ENV === 'production') {
    var _getOptions = getOptions(pluginOptions),
        plausibleDomain = _getOptions.plausibleDomain,
        scriptURI = _getOptions.scriptURI,
        domain = _getOptions.domain,
        excludePaths = _getOptions.excludePaths,
        trackAcquisition = _getOptions.trackAcquisition;

    var plausibleExcludePaths = [];

    var Minimatch = require("minimatch").Minimatch;

    excludePaths.map(function (exclude) {
      var mm = new Minimatch(exclude);
      plausibleExcludePaths.push(mm.makeRe());
    });
    var scriptProps = {
      async: true,
      defer: true,
      'data-domain': domain,
      src: "https://" + plausibleDomain + scriptURI
    };

    if (trackAcquisition) {
      scriptProps['data-track-acquisition'] = true;
    }

    return setHeadComponents([/*#__PURE__*/_react.default.createElement("link", {
      key: "gatsby-plugin-plausible-preconnect",
      rel: "preconnect",
      href: "https://" + plausibleDomain
    }), /*#__PURE__*/_react.default.createElement("script", (0, _extends2.default)({
      key: "gatsby-plugin-plausible-script"
    }, scriptProps)),
    /*#__PURE__*/
    //See: https://docs.plausible.io/goals-and-conversions#trigger-custom-events-with-javascript
    _react.default.createElement("script", {
      key: "gatsby-plugin-plausible-custom-events",
      dangerouslySetInnerHTML: {
        __html: "\n          window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };\n          " + (excludePaths.length ? "window.plausibleExcludePaths=[" + excludePaths.join(",") + "];" : "") + "\n          "
      }
    })]);
  }

  return null;
};