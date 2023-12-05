import { styled } from "styled-components";
import { motion } from "framer-motion";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toggleCreateFeed } from "../../counterSlice";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { greenColor } from "../../color";

const CREATE_FEED_MUTATION = gql`
  mutation Mutation($title: String!, $text: String!, $avatar: Upload) {
    createFeed(title: $title, text: $text, avatar: $avatar) {
      ok
      error
    }
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  width: 600px;
  height: 770px;
  border-radius: 7px;
  background-color: white;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const LoginBoxHeader = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    margin: 0 23px;
    font-size: 22px;
    color: rgba(0, 0, 0, 0.8);
    &:first-child {
      font-family: "Times New Roman", Times, serif;
      letter-spacing: 1px;
    }
    &:last-child {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const LoginBoxContent = styled.div`
  margin-top: 20px;
  width: 520px;
  height: 650px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-left: 80px;
`;

const Div = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  span {
    &:first-child {
      font-size: 24px;
      font-weight: 600;
      color: black;
    }
    &:last-child {
      font-size: 23px;
      margin-top: 15px;
      color: #69d802;
      font-weight: 600;
    }
  }
`;

const Form = styled.form`
  width: 100%;
  height: 440px;
`;

const Input = styled.input<{ isvalid: string }>`
  width: 440px;
  height: 50px;
  border-radius: 20px;
  margin: 10px 0;
  border: 1px solid
    ${({ isvalid }) =>
      isvalid === "true"
        ? "rgba(21, 83, 177, 0.2)"
        : "rgba(211, 44, 44, 0.61)"};
  outline: none;
  text-indent: 15px;
  font-size: 15px;
  &:focus {
    border: 3px solid
      ${({ isvalid }) =>
        isvalid === "true"
          ? "rgba(21, 83, 177, 0.2)"
          : "rgba(211, 44, 44, 0.61)"};
  }
`;

const TextArea = styled.textarea<{ isvalid: string }>`
  width: 440px;
  height: 340px;
  border-radius: 20px;
  margin-top: 20px;
  padding-top: 20px;
  resize: none;
  outline: none;
  border: 1px solid
    ${({ isvalid }) =>
      isvalid === "true"
        ? "rgba(21, 83, 177, 0.2)"
        : "rgba(211, 44, 44, 0.61)"};
  outline: none;
  text-indent: 15px;
  font-size: 15px;
  &:focus {
    border: 3px solid
      ${({ isvalid }) =>
        isvalid === "true"
          ? "rgba(21, 83, 177, 0.2)"
          : "rgba(211, 44, 44, 0.61)"};
  }
`;

const Button = styled.button`
  width: 440px;
  height: 55px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
  cursor: pointer;
  border: none;
  background-color: ${greenColor};
  color: white;
`;

const AvatarDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
`;

const Avatar = styled.div<{ url: string | null }>`
  width: 50px;
  height: 50px;
  border-radius: 10%;
  margin-top: 10px;
  margin-right: 10px;
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
`;

const Label = styled.label`
  margin: 15px 0 0px 0;
  font-weight: bold;
  font-size: 15px;
  color: #0095f6;
  display: inline-block;
  cursor: pointer;
`;

export const overlayVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

interface FormData {
  title: string;
  text: string;
}

const CreateFeedForm = () => {
  const [avatarFile, setAvatarFile] = useState();
  const [newAvatar, setNewAvatar] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onCompleted = (data: any) => {
    const {
      createFeed: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      dispatch(toggleCreateFeed());
      window.location.reload();
    }
  };
  const [createFeed, loading] = useMutation(CREATE_FEED_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = () => {
    const { title, text } = getValues();
    createFeed({
      variables: {
        title,
        text,
        ...(avatarFile !== undefined && { avatar: avatarFile }),
      },
    });
  };

  const onChange = (e: any) => {
    if (e.target.files.length === 0) return;
    const {
      target: {
        files: [file],
      },
    } = e;
    setAvatarFile(file);

    var reader = new FileReader();
    reader.onload = function (event: any) {
      setNewAvatar(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <Overlay
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LoginBox>
        <LoginBoxHeader>
          <span>Feed</span>
          <span onClick={() => dispatch(toggleCreateFeed())}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </LoginBoxHeader>
        <LoginBoxContent>
          <Form onSubmit={handleSubmit(onSubmitValid)}>
            <Div>
              <Input
                isvalid={!errors?.title ? "true" : "false"}
                {...register("title", { required: true })}
                type="text"
                name="title"
                placeholder="제목을 입력해주세요"
              ></Input>
              <TextArea
                {...register("text", {
                  required: true,
                })}
                name="text"
                isvalid={!errors?.text ? "true" : "false"}
                placeholder="내용을 입력해주세요"
              ></TextArea>
            </Div>
            <AvatarDiv
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              {newAvatar ? <Avatar url={newAvatar}></Avatar> : null}
              <Label className="signup-profileImg-label" htmlFor="profileImg">
                이미지 업로드
              </Label>
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                id="profileImg"
                onChange={(e: any) => onChange(e)}
              />
            </AvatarDiv>
            <Div style={{ marginTop: "30px" }}>
              <Button
                disabled={loading.loading ? true : false}
                style={{ opacity: loading.loading ? "0.5" : "1" }}
              >
                글쓰기
              </Button>
            </Div>
          </Form>
        </LoginBoxContent>
      </LoginBox>
    </Overlay>
  );
};

export default CreateFeedForm;
