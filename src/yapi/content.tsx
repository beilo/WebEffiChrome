import {
  copy, formatJson, getInterfaceString, getTempForAxios, handelReqQuery, logger, message, options
} from "../utils/yapi-utils";
import styled from "styled-components";
import useSWR from "swr";

const jstt = require("./bundle");

const isMock = false;
function getData() {
  var interfaceId = window.location.pathname.replace(
    /\/project\/\d+\/interface\/api\//,
    ""
  );

  if (isMock) {
    return require("./mock.json");
  }
  return fetch(
    "https://" + window.location.host + "/api/interface/get?id=" + interfaceId
  )
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(function (data) {
      return data;
    });
}

export default function YapiContent() {
  const { data, error, mutate } = useSWR("/api/interface/get", getData);
  const res = data?.data ?? {};
  const apiName = res.path ? getInterfaceString(res.path) : "";


  function handleRetry() {
    mutate();
  }

  async function handleYapiRes() {
    const body = JSON.parse(res.res_body);
    body.title = apiName + "Res"
    try {
      const jsttTs = await jstt.compile(
        formatJson(body),
        body.title,
        options
      );
      copy(jsttTs);
      message({ text: "复制成功", type: "success" });
    } catch (error) {
      logger.error(error);
      message({ text: "生成失败", type: "error" });
    }
  }
  async function handleYapiReq() {
    const req_params = JSON.parse(res.req_body_other || "{}");
    const req_query = res.req_query || [];
    const jsttTsList = ["", ""];

    try {
      if (req_query.length > 0) {
        const formattedQuery = formatJson(handelReqQuery(req_query));
        formattedQuery.title = apiName + "Query"
        jsttTsList[0] = await jstt.compile(
          formattedQuery,
          formattedQuery.title,
          options
        );
      }

      if (Object.keys(req_params).length > 0) {
        const formattedParams = formatJson(req_params);
        formattedParams.title = apiName + "Params"
        jsttTsList[1] = await jstt.compile(
          formattedParams,
          formattedParams.title,
          options
        );
      }

      copy(jsttTsList.join(""));
      message({ text: "复制成功", type: "success" });
    } catch (error) {
      logger.error(error);
      message({ text: "生成失败", type: "error" });
    }
  }

  const hanleAxiosTemp = () => {
    let tempRes = getTempForAxios({
      notes: res.title,
      method: res.method,
      path: res.path
    })
    copy(tempRes);
  }
  return (
    <Box>
      <Title>TS 类型定义</Title>
      <YapiResBtn onClick={handleYapiRes}>返回数据</YapiResBtn>
      <YapiReqBtn onClick={handleYapiReq}>请求 body</YapiReqBtn>
      <YapiReqBtn onClick={hanleAxiosTemp}>axios模板</YapiReqBtn>
    </Box>
  );
}

const Box = styled.div`
  position: fixed;
  color: rgba(0, 0, 0, 0.65);
  right: 5px;
  top: 200px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(26, 192, 128, 0.5) 0px 0px 6px -1px;
  width: 180px;
  border-radius: 2px;
  padding: 8px 12px;
  box-sizing: border-box;
  width: 180px;
`;
const Title = styled.h4`
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(240, 240, 240);
`;

const YapiResBtn = styled.button`
  background-color: rgba(26, 192, 198, 0.8);
  color: rgb(255, 255, 255);
  margin-right: 8px;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(26, 192, 198);
  border-image: initial;
  cursor: pointer;
`;
const YapiReqBtn = styled.button`
  background-color: rgba(255, 168, 34, 0.8);
  color: rgb(255, 255, 255);
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(255, 168, 34);
  border-image: initial;
  cursor: pointer;
`;
