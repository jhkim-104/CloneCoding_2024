import styled from "styled-components";

export const Notice = styled.span`
  width: 100%;
  background-color: #f5f5dc;
  color: #5c4033;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin: 5px auto;
  max-width: 90%;
`;

export const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 5px 0;
  height: 30px;
  width: 30px;
  svg {
    width: 30px;
    fill: lightgray;
  }
  &.tweet-delete {
    svg {
      fill: tomato;
    }
  }
`;
