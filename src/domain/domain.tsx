import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Domain() {
  const [domains, setDomains] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  function handleDeleteDomain(index: number) {
    const newDomains = [...domains];
    newDomains.splice(index, 1);
    saveDomains(newDomains);
  }

  function handleAddDomain() {
    if (inputValue.trim() === "") {
      return;
    }
    const newDomains = [...domains, inputValue];
    saveDomains(newDomains);
    setInputValue("");
  }
  useEffect(() => {
    chrome.storage.local.get("domain", function (data: any) {
      setDomains(data?.domain || []);
    });
  }, []);

  function saveDomains(domains: string[]) {
    chrome.storage.local.get("domain", function (data: any) {
      chrome.storage.local.set({ domain: domains });
      setDomains(domains);
    });
  }

  return (
    <Box>
      <Title>同步cookie</Title>
      <List>
        {domains.map((domain, index) => (
          <ListItem key={domain} className="sync-cookie__list-item">
            {domain}
            <DelBtn
              className="sync-cookie__delete-button"
              onClick={() => handleDeleteDomain(index)}
            >
              删除
            </DelBtn>
          </ListItem>
        ))}
        <AddDomainBox className="sync-cookie__add-domain">
          <Input
            className="sync-cookie__input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <AddBtn className="sync-cookie__add-button" onClick={handleAddDomain}>
            添加
          </AddBtn>
        </AddDomainBox>
      </List>
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
`;
const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 400px;
  &:hover {
    background-color: #f5f5f5;
  }
`;
const DelBtn = styled.button`
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`;
const AddDomainBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;
const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-right: 8px;
  width: 300px;
`;
const AddBtn = styled.button`
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #1976d2;
  }
`;
