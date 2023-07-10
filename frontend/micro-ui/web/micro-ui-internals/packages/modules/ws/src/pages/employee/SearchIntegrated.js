import { Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

const SearchIntegrated = ({ path }) => {
  const [isBothCallsFinished, setIsBothCallFinished] = useState(true);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});
  const [setLoading, setLoadingState] = useState(false);
  const SWater = Digit.ComponentRegistryService.getComponent("WSSearchWaterConnectionIntegrated");
  //const [businessServ, setBusinessServ] = useState([]);
  const getUrlPathName = window.location.pathname;
  const checkPathName = getUrlPathName.includes("water/search");
  const businessServ = checkPathName ? "WS" : "SW";

  const [showToast, setShowToast] = useState(null);
  const serviceConfig = {
    WATER: "WATER",
    SEWERAGE: "SEWERAGE",
  };

  const onSubmit = useCallback((_data) => {
    
    const { connectionNumber, oldConnectionNumber, mobileNumber, propertyId } = _data;   
    if (!connectionNumber && !oldConnectionNumber && !mobileNumber && !propertyId) {
      setShowToast({ error: true, label: "WS_HOME_SEARCH_CONN_RESULTS_DESC" });
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      downloadIntegratedBill(propertyId)
      setPayload(
        Object.keys(_data)
          .filter((k) => _data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof _data[key] === "object" ? _data[key].code : _data[key] }), {})
      );
     
    }
  });

const downloadPdf = (blob, fileName) => {
    if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        window.mSewaApp.downloadBase64File(base64data, fileName);
      };
    } else {
      const link = document.createElement("a");
      // create a blobURI pointing to our Blob
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    }
  };
  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };

  let result1 = Digit.Hooks.ws.useSearchWS({ tenantId, filters: payload, config, bussinessService: "WS", t ,shortAddress:true});
  let result = Digit.Hooks.ws.useSearchWS({ tenantId, filters: payload, config, bussinessService: "SW", t ,shortAddress:true});
  

  // let result2 = Digit.WSService.WSSewsearch({ tenantId, propertyId:"PG-PT-2023-01-08-006216",searchType:"CONNECTION3"});
  // console.log(result2)
//   let result = Digit.WSService.wnsGroupBill()
//   console.log(result);
  const downloadIntegratedBill = async(propertyId) => {
   //console.log("rsult 2",tenantId,_data.propertyId)
    let result = await Digit.WSService.wnsGroupBill({ propertyId,tenantId });
    console.log("result22");
     //downloadPdf(new Blob([result.data], { type: "application/pdf" }), `CHALLAN1234.pdf`);
     downloadPdf(new Blob([result.data], { type: "application/pdf" }), `IntegratedBill.pdf`);
    console.log("result", result);
}
  const isMobile = window.Digit.Utils.browser.isMobile();

 

  const getData = () => {
    if (result?.data?.length == 0 &&  result1?.data?.length == 0) {
      return { display: "ES_COMMON_NO_DATA" }
    } else if (result?.data?.length > 0 || result?.data?.length > 0) {
      return [...result?.data,...result1.data]
    } else {
      return [];
    }
  }

  const isResultsOk = () => {
    return result?.data?.length > 0 ? true : false;
  }

  if(!result?.isLoading)
    result.data = result?.data?.map((item) => {
      if (item?.connectionNo?.includes("WS")) {
        item.service = serviceConfig.WATER;
      } else if (item?.connectionNo?.includes("SW")) {
        item.service = serviceConfig.SEWERAGE;
      }
      return item;
    });

  return (
    <Fragment>
      <SWater
        t={t}
        tenantId={tenantId}
        onSubmit={onSubmit}
        data={getData()}
        count={10}
        resultOk={isResultsOk()}
        businessService={businessServ}
       
      />

      {showToast && (
        <Toast
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default SearchIntegrated;