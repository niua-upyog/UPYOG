import React from "react";
import ReactDOM from "react-dom";
import initLibraries from "@egovernments/digit-ui-libraries";
import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

initLibraries();

const userServiceData = {
  userInfo: {
    id: 23349,
    uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
    userName: "9404052047",
    name: "Aniket T",
    mobileNumber: "9404052047",
    emailId: "xc@gmail.com",
    locale: null,
    type: "CITIZEN",
    roles: [
      {
        name: "Citizen",
        code: "CITIZEN",
        tenantId: "pb",
      },
    ],
    active: true,
    tenantId: "pb",
  },
};

Digit.SessionStorage.set("citizen.userServiceData", userServiceData);

const citAuth = process.env.REACT_APP_CITIZEN_AUTH;

console.log("citAUth", citAuth);

Digit.SessionStorage.set("citizen.token", citAuth);
window.sessionStorage.setItem("citizen.token", citAuth);

ReactDOM.render(
  <Router>
    <Body>
      {/* <TopBar /> */}
      {/* <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" /> */}

      <TopBar />
      {/* <Switch> */}
      {/* <Route path="/digit-ui/pgr"> */}
      <PGRModule stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
      {/* </Route> */}
      {/* <Route>
          <PGRLinks />
        </Route> */}
      {/* </Switch> */}
    </Body>
  </Router>,
  document.getElementById("root")
);
