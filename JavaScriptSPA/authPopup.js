// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new Msal.UserAgentApplication(msalConfig);
let token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjIyb2o3UzcyMWF3RWpHSGdOLXpxYTJ4UkFfOWRLUTNkVHFobU1tQnRhbTQiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MmQwNjM4Mi05N2U0LTQ5Y2MtODMzNC0yZTllN2NlMTQ1OTQvIiwiaWF0IjoxNjA0MDk5MDM1LCJuYmYiOjE2MDQwOTkwMzUsImV4cCI6MTYwNDEwMjkzNSwiYWlvIjoiRTJSZ1lEaVdMaVhWVUxuNjRzWGd3eWErYjV2K0FBQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJncmFwaG1hbmFnZW1lbnRhcHAxIiwiYXBwaWQiOiI1NzFiZDJiZC0zNzQ3LTQ3MTEtODU4Mi0zZDU3MGNkZDg1YmMiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MmQwNjM4Mi05N2U0LTQ5Y2MtODMzNC0yZTllN2NlMTQ1OTQvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJlYmEwMjE3Mi03YjIwLTRjMTctOWVmOS0yNmJiMTZjNDQ0ZjAiLCJyaCI6IjAuQUFBQWdtUFFZdVNYekVtRE5DNmVmT0ZGbEwzU0cxZEhOeEZIaFlJOVZ3emRoYndlQUFBLiIsInJvbGVzIjpbIlVzZXIuUmVhZC5BbGwiXSwic3ViIjoiZWJhMDIxNzItN2IyMC00YzE3LTllZjktMjZiYjE2YzQ0NGYwIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiNjJkMDYzODItOTdlNC00OWNjLTgzMzQtMmU5ZTdjZTE0NTk0IiwidXRpIjoiY0p3bERZeGRlVU96ZUdaTXpud1dBQSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxNTc3MTM3NzgxfQ.qv82KSuFADuUjJfBvpK-NBFlhAXvqt6KAyO35GMDDCkqlVaeAGqxNF4w5Bftq0BXVR2NgP68rLc1VYrpzRvJ8U4b0wfHBM_mvynfTrShltA19w87zcGU0RF8c6_R0e_IheKHLVMyuWXm1HvpVGmozYrfACCC_3YrgH7sMSrycC3NL58MeDtKSJqTaYs6_mlPntYBly5OkfO5WNM59PdC27oxEhA_bqNlFPjOaJB5Pi5B_8B1j-NjRLrWozMRNw6SoQK0uqdaHUkvWS2VxiSQIQIgDwpsLsXB00bAUDPZcg9Zzl5Hh73aXkJt01aTPED7bYwpxvXiFKcz5FanO2bZbA"
let meID = "2914a3da-9abe-4740-950b-f309528d278e"
async function signIn() {
  let results = await fetch(`https://graph.microsoft.com/v1.0/users/${meID}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  let resultJSON = await results.json();
  console.log(resultJSON);
}

// Sign-out the user
function logout() {
  // Removes all sessions, need to call AAD endpoint to do full logout
  myMSALObj.logout();
}

function getTokenPopup(request) {
  return myMSALObj.acquireTokenSilent(request)
    .catch(error => {
      console.log("Silent token acquisition fails. Acquiring token using popup");
      console.log(error);
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenPopup(request)
        .then(tokenResponse => {
          console.log("access_token acquired at: " + new Date().toString());
          return tokenResponse;
        }).catch(error => {
          console.log(error);
        });
    });
}

// Acquires and access token and then passes it to the API call
function passTokenToApi() {
  getTokenPopup(tokenRequest)
    .then(tokenResponse => {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          logMessage("Request made to Web API:");
          callApiWithAccessToken(apiConfig.webApi, tokenResponse.accessToken);
        } catch(err) {
          console.log(err);
        }
    });
}

function editProfile() {
  myMSALObj.loginPopup(b2cPolicies.authorities.editProfile)
    .then(tokenResponse => {
        console.log("access_token acquired at: " + new Date().toString());
        console.log(tokenResponse);
    });
}