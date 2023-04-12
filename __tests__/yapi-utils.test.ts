import { getFormattedString, getInterfaceString } from "../src/utils/yapi-utils";
// const { getFormattedString } = require("../src/utils/yapi-utils")


describe('My App', () => {
    let path = '/get/test'
    it("getFormattedString", () => {
        expect(getFormattedString(path)).toBe("GetTest")
        expect(getFormattedString(path, false)).toBe("getTest")
        expect(getFormattedString('/crm-common/virtual/tag/list', false)).toBe("crmCommonVirtualTagList")
    })
    it("getInterfaceString", () => {
        expect(getInterfaceString(path)).toBe("IGetTest")
        expect(getInterfaceString('/crm-common/virtual/tag/list')).toBe("ICrmCommonVirtualTagList")
    })
});  