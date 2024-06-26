import {
  copy,
  formatJson,
  getInterfaceString,
  getTempForAxios,
  handelReqQuery,
  logger,
  options,
} from "../utils/yapi-utils";
import styled from "styled-components";
import useSWR from "swr";
import { useState, useRef } from "react";

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
    body.title = apiName + "Res";
    try {
      const jsttTs = await jstt.compile(formatJson(body), body.title, options);
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
        formattedQuery.title = apiName + "Query";
        jsttTsList[0] = await jstt.compile(
          formattedQuery,
          formattedQuery.title,
          options
        );
      }

      if (Object.keys(req_params).length > 0) {
        const formattedParams = formatJson(req_params);
        formattedParams.title = apiName + "Params";
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

  const handleAxiosTemp = () => {
    try {
      let tempRes = getTempForAxios({
        notes: `${res.title} ${window.location.href}`,
        method: res.method,
        path: res.path,
      });
      copy(tempRes);
      message({ text: "复制成功", type: "success" });
    } catch (error) {
      logger.error(error);
      message({ text: "生成失败", type: "error" });
    }
  };

  const [msg, setMsg] = useState({
    text: "",
    type: "success" as "success" | "error",
  });
  const timer = useRef<NodeJS.Timeout | null>(null);
  const message = (message: { text: string; type: "success" | "error" }) => {
    setMsg(message);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setMsg({ text: "", type: "success" });
    }, 1500);
  };
  let messageClass = msg.text ? "" : "is-leaving";
  if (msg.type === "error") {
    messageClass += " error";
  } else if (msg.type === "success") {
    messageClass += " success";
  }
  return (
    <>
      <Box>
        <Title>TS 类型定义</Title>
        <YapiResBtn onClick={handleYapiRes}>返回数据</YapiResBtn>
        <YapiReqBtn onClick={handleYapiReq}>请求 body</YapiReqBtn>
        <YapiReqBtn onClick={handleAxiosTemp}>axios模板</YapiReqBtn>

        <Message className={messageClass}>
          <span>{msg.text}</span>
        </Message>
      </Box>
    </>
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
const Message = styled.div`
  position: fixed;
  top: 150px;
  right: 0;
  color: #fff;
  background-color: #666;
  display: flex;
  align-items: center;
  min-width: 100px;
  padding: 6px 12px 6px 7px;
  height: 30px;
  opacity: 0.8;
  box-sizing: border-box;
  border-radius: 15px 0 0 15px;
  transition: all 0.4s ease-in;
  &.is-leaving {
    opacity: 0;
    transform: translateX(100%);
  }
  &.success {
    background-color: #52c41a;
  }
  &.error {
    background-color: #f5222d;
  }
`;
