import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const person = require("../img/person.png");

const AvatarDiv = styled.div<{ url: string | undefined }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 25px;
  background-image: url(${({ url }) => (url ? url : person)});
  background-size: cover;
  background-position: center;
  cursor: pointer;
`;

interface propInt {
  id: number | undefined;
  username: string | undefined;
  avatar: string | undefined;
}

const MatchInfoProfile = ({ id, username, avatar }: propInt) => {
  const navigate = useNavigate();

  const onClicked = () => {
    if (!id) return;
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      <AvatarDiv onClick={onClicked} url={avatar} />
      <span>{username ? username : "someone"}</span>
    </div>
  );
};

export default MatchInfoProfile;
