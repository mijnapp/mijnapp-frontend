
Branch | Build | Frontend Test | Backend Test | Frontend Acceptance | Backend Acceptance
--- | --- | --- | --- | --- | --- |
develop | [![Build Status](https://dev.azure.com/mijnapp/mijnapp-frontend/_apis/build/status/mijnapp-frontend-backend?branchName=develop)](https://dev.azure.com/mijnapp/mijnapp-frontend/_build/latest?definitionId=3&branchName=develop) | ![Deployment Status](https://vsrm.dev.azure.com/mijnapp/_apis/public/Release/badge/e0fb6146-0797-463a-b938-c72b8f3ba55d/1/1) | ![Deployment Status](https://vsrm.dev.azure.com/mijnapp/_apis/public/Release/badge/e0fb6146-0797-463a-b938-c72b8f3ba55d/1/2) | N/A | N/A |
master | [![Build Status](https://dev.azure.com/mijnapp/mijnapp-frontend/_apis/build/status/mijnapp-frontend-backend?branchName=master)](https://dev.azure.com/mijnapp/mijnapp-frontend/_build/latest?definitionId=3&branchName=master) | ![Deployment Status](https://vsrm.dev.azure.com/mijnapp/_apis/public/Release/badge/e0fb6146-0797-463a-b938-c72b8f3ba55d/1/3) | ![Deployment Status](https://vsrm.dev.azure.com/mijnapp/_apis/public/Release/badge/e0fb6146-0797-463a-b938-c72b8f3ba55d/1/4) | | |

# mijnapp-frontend

https://mijn-app.io/inwoner/index.html

# DigiD development
To work with DigiD on your local machine you should do the following:

1. Set up a reversed proxy for your local client running on localhost:3000.
   You could do this for instance using ngrok. Download it and then run:
   ngrok.exe http 3000

2. Add the URL of the reversed proxy (for instance 'https://0db66292.ngrok.io') to the 'Origins' setting in appsettings.json of the BackEnd project

3. Compile and run the BackEnd project

4. Test the client by browsing to the URL of the reversed proxy
