export const logger = {
  tag: "web-effi-chrome",
  log(msg: any) {
    console.log(logger.tag, msg);
  },
  error(msg: any) {
    console.error(logger.tag, msg);
  },
};

// 处理选项
export const options = {
  bannerComment: "",
  declareExternallyReferenced: true,
  enablevarEnums: true,
  unreachableDefinitions: false,
  strictIndexSignatures: false,
  format: false,
  unknownAny: false,
};

// 复制文本
export function copy(value: string) {
  logger.log(value);

  navigator.clipboard.writeText(value).then(
    function () {
      console.log("复制成功！");
    },
    function (err) {
      console.error("无法复制：", err);
    }
  );
}

// 格式化 JSON
export function formatJson(object: any) {
  var cloneObject = JSON.parse(JSON.stringify(object));
  cloneObject.additionalProperties = false;

  function loop(looper: any) {
    for (var key in looper) {
      if (looper[key].properties) {
        looper[key].additionalProperties = false;
      }
      if (typeof looper[key] === "object") {
        loop(looper[key]);
      }
    }
  }
  loop(cloneObject);
  return cloneObject;
}

// 提取path转成大驼峰
export function getFormattedString(str: string, firstIsUpperCase = true) {
  if (!str) {
    return "";
  }

  var words = str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0 || words[0] === "") {
    return "";
  }

  var output = "";
  for (var i = 0; i < words.length; i++) {
    if (!firstIsUpperCase && i === 0) {
      output += words[i];
    } else {
      output += words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }

  return output;
}
// 提取path转成接口
export function getInterfaceString(str: string) {
  return "I" + getFormattedString(str);
}

// 处理req_query
export function handelReqQuery(req_query: any) {
  return req_query.reduce(
    (acc: any, curr: any) => {
      acc.properties[curr.name] = {
        type: "string",
        description: curr.desc,
      };
      if (curr.required === "1") {
        acc.required.push(curr.name);
      }
      return acc;
    },
    {
      type: "object",
      title: "title",
      properties: {},
      required: [],
    }
  );
}

export const getTempForAxios = (params: {
  notes: string;
  method: "POST" | "GET";
  path: string;
}) => {
  const { path, notes, method } = params;
  let apiName = getFormattedString(path, false);
  let resApiTypeName = getInterfaceString(path) + "Res";
  let temp = "";
  if (method === "GET") {
    temp = `// ${notes}
      export const ${apiName} = async (params) => {
          return await api.${method.toLocaleLowerCase()}('${path}', { params });
      }`;
  } else if (method === "POST") {
    temp = `// ${notes}
      export const ${apiName} = async (data) => {
          return await api.${method.toLocaleLowerCase()}('${path}', data);
      }`;
  }
  return temp;
};
