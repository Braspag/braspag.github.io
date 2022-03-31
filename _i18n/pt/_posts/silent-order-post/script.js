document.addEventListener("DOMContentLoaded", function(event) {  
  if(environment == 'sandbox') {
    document.getElementById("flexRadioSandbox").checked = true;
  } else if (environment == 'production') {
    document.getElementById("flexRadioProduction").checked = true;
  }
});

var environment = getQueryString("env");
document.onload = loadEnvironment(environment);

function setEnvironment() {
  var url = window.location.href.split('?')[0]
  var urlEnvironment = url + `?env=${document.querySelector('input[name=flexRadioEnvironment]:checked').value}`
  window.location.href = urlEnvironment
}

function sendCardData() {
  var accessToken = document.getElementById("AccessToken").value;
  var element = null;

  if (!accessToken) {
    element = document.getElementById('error');
    element.innerHTML = "'Access Token' do SOP não foi obtido.";
    element.style.display = "block";
    return;
  }

  var enableVerifyCardCheck = document.getElementById('verifyCard');
  var enableBinQueryCheck = document.getElementById('binQuery');
  var enableTokenizeCheck = document.getElementById('tokenize');

  var options = {
    accessToken: accessToken,
    onSuccess: function (response) {
      if (response.CardToken != undefined) {
        element = document.getElementById('card-token');
        element.innerHTML = "<b>" + response.CardToken.toUpperCase() + "</b>";
        // element.style.display = "block";
      }
      else {
        element = document.getElementById('payment-token');
        element.innerHTML = "<b>" + response.PaymentToken.toUpperCase() + "</b>";
        // element.style.display = "block";
      }
      element = document.getElementById('raw-message');
      element.innerHTML = "<pre>" + JSON.stringify(response, null, '\t') + "</pre>";
      element.style.display = "block";
    },
    onError: function (response) {
      element = document.getElementById('error');
      element.innerHTML = "HTTP " + response.Code;
      element.style.display = "block";
    },
    onInvalid: function (validationResults) {
      for (var i = 0; i < validationResults.length; i++) {

        var field = validationResults[i].Field;
        var message = validationResults[i].Message;

        element = document.getElementById(field);
        element.innerHTML = field + " " + message;
        element.style.display = "inline";

      }
    },
    environment: environment,
    language: "PT",
    enableBinQuery: enableBinQueryCheck.checked == true,
    enableVerifyCard: enableVerifyCardCheck.checked == true,
    enableTokenize: enableTokenizeCheck.checked == true,
    cvvrequired: false
  };

  bpSop_silentOrderPost(options);

}

function hideResults() {

  var elements = null;

  try {
    elements = document.getElementsByClassName('validation-messages');
  }
  catch (e) {
    elements = document.querySelectorAll('.validation-messages');
  }

  // for (var i = 0; i < elements.length; i++) {
  //   elements[i].style.display = "none";
  // }

  document.getElementById('payment-token').style.display = "none";
  document.getElementById('card-token').style.display = "none";
  document.getElementById('raw-message').style.display = "none";
}

function getAccessToken() {
  var merchantId = document.getElementById("Mid").value;
  var bearerAccessToken = document.getElementById("oauth-access-token").value;

  var url = getAccessTokenUrl(environment) + "?merchantid=" + merchantId;
  var request = new XMLHttpRequest();

  if ('withCredentials' in request) {
    if (bearerAccessToken) {
      url = getAccessTokenv2Url(environment);
      request.open("POST", url, true);
      request.setRequestHeader("MerchantId", merchantId);
      request.setRequestHeader("Authorization", bearerAccessToken);
    }
    else {
      request.open("POST", url, true);
    }

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 201) {
          element = document.getElementById("error");
          element.innerHTML = "";
          var jsonResponse = JSON.parse(request.responseText);
          element = document.getElementById("AccessToken");
          // element.className = "";
          element.value = jsonResponse.AccessToken;
          element.innerHTML = "<b>" + jsonResponse.AccessToken + "</b><br>" + "Issued: " + jsonResponse.Issued + "<br>" + "ExpiresIn: " + jsonResponse.ExpiresIn;
          element.style.display = "block";
        }
        else {
          element = document.getElementById("AccessToken");
          element.innerHTML = "";
          element.value = undefined;
          element = document.getElementById('error');
          element.innerHTML = "HTTP " + request.status + ": erro ao obter o 'Access Token' do SOP (<b>" + url + "</b>).";
          element.style.display = "block";
        }
      }
    }
    request.setRequestHeader("Accept", "application/json");
    request.send();
  }
  else if (XDomainRequest) {
    request = new XDomainRequest();
    request.timeout = 3000;
    request.open('POST', url);
    request.onload = function () {
      element = document.getElementById("error");
      element.innerHTML = "";
      var jsonResponse = JSON.parse(request.responseText);
      element = document.getElementById(" ");
      // element.className = "";
      element.value = jsonResponse.AccessToken;
      element.innerHTML = "<b>" + jsonResponse.AccessToken + "</b><br>" + "Issued: " + jsonResponse.Issued + "<br>" + "ExpiresIn: " + jsonResponse.ExpiresIn;
      element.style.display = "block";
    }
    request.onerror = function () {
      element = document.getElementById("AccessToken");
      element.innerHTML = "";
      element.value = undefined;
      element = document.getElementById('error');
      element.innerHTML = "Erro ao obter o 'Access Token' do SOP.";
      element.style.display = "block";
    }
    request.send();
  }
}

function getAccessTokenUrl(environment) {
  switch (environment) {
    case "sandbox":
      return "https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken";
    case "production":
      return "https://www.pagador.com.br/post/api/public/v1/accesstoken";
  }
  return "";
}

function getAccessTokenv2Url(environment) {
  switch (environment) {
    case "sandbox":
      return "https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken";
    case "production":
      return "https://www.pagador.com.br/post/api/public/v2/accesstoken";
  }
  return "";
}

function getQueryString(field) {
  var href = window.location.href;
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  var string = reg.exec(href);
  return string ? string[1] : null;
}

function loadEnvironment(environment) {
  var element = document.createElement("script");
  switch (environment) {
    case "sandbox":
      element.src = "https://transactionsandbox.pagador.com.br/post/Scripts/silentorderpost-1.0.min.js";
      break;
    case "production":
      element.src = "https://transactionscus.pagador.com.br/post/Scripts/silentorderpost-1.0.min.js";
      break;
  }
  document.body.appendChild(element);
}
