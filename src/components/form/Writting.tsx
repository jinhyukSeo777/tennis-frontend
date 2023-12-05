import styled from "styled-components";
import { greenColor } from "../../color";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import useUser from "../../useUser";
import Loader from "../Loader";

const SEE_FEED_MUTATION = gql`
  query SeeFeed($id: Int!) {
    seeFeed(id: $id) {
      id
      title
      text
      avatar
      commentNum
      see
      comments {
        id
        createdAt
        text
        user {
          id
          username
          avatar
        }
      }
      createdAt
      user {
        id
        avatar
        username
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($feedId: Int!, $text: String!) {
    createComment(feedId: $feedId, text: $text) {
      ok
      error
    }
  }
`;

const DELETE_FEED_MUTATION = gql`
  mutation Mutation($id: Int!) {
    deleteFeed(id: $id) {
      ok
      error
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation Mutation($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.div`
  flex-grow: 1;
  height: 100%;
  padding: 0 25px;
`;

const WrittingTop = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const WrittingMiddle = styled.div`
  width: 100%;
  padding: 25px 0;
  > div {
    &:nth-child(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
        > div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          &:last-child {
            margin-left: 5px;
            span {
              font-size: 14.5px;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
    &:nth-child(2) {
      margin-top: 20px;
      font-size: 24px;
      color: #2e2d2d;
    }
    &:nth-child(4) {
      margin: 40px 0 80px 0;
      font-size: 15px;
      width: 90%;
      line-height: 20px;
      word-break: break-all;
    }
  }
`;

const WrittingBottom = styled.div`
  height: 100px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 30px;
  button {
    border: none;
    cursor: pointer;
    border-radius: 7px;
    height: 50px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    background-color: ${greenColor};
    margin-bottom: 30px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 180px;
  padding: 10px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  resize: none;
  outline: none;
  text-indent: 10px;
  font-size: 16px;
`;

const Comment = styled.div`
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  > div {
    &:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
        > div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          &:last-child {
            margin-left: 5px;
            span {
              font-size: 13px;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
    &:last-child {
      margin: 15px 0 5px 0;
      font-size: 18px;
    }
  }
`;

const Avatar = styled.div<{ url: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
  cursor: pointer;
`;

const Photo = styled.div<{ url: string }>`
  margin-top: ${({ url }) => (url ? "50px" : "0px")};
  width: 400px;
  height: ${({ url }) => (url ? "300px" : "50px")};
  border-radius: 4%;
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
`;

interface FormData {
  keyword: string;
  text: string;
}

const Writting = () => {
  const { id } = useParams();
  const { data: myData } = useUser();

  const navigate = useNavigate();

  const { data: feedData } = useQuery(SEE_FEED_MUTATION, {
    variables: { id: Number(id) },
  });

  const { register, getValues, handleSubmit } = useForm<FormData>();

  const onCompleted = (data: any) => {
    const {
      createComment: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      window.location.reload();
    }
  };
  const onFeedDeleteCompleted = (data: any) => {
    const {
      deleteFeed: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      navigate("/community");
      window.location.reload();
    }
  };
  const onCommentDeleteCompleted = (data: any) => {
    const {
      deleteComment: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      window.location.reload();
    }
  };

  const [createComment, loading] = useMutation(CREATE_COMMENT_MUTATION, {
    onCompleted,
  });
  const [deleteFeed] = useMutation(DELETE_FEED_MUTATION, {
    onCompleted: onFeedDeleteCompleted,
  });
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    onCompleted: onCommentDeleteCompleted,
  });

  const onTextSubmit = () => {
    const { text } = getValues();
    createComment({
      variables: {
        text,
        feedId: Number(id),
      },
    });
  };
  const onFeedDelete = (id: number) => {
    deleteFeed({
      variables: {
        id,
      },
    });
  };
  const onCommentDelete = (id: number) => {
    deleteComment({
      variables: {
        id,
      },
    });
  };

  const calDate = (date: number) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <>
      {feedData ? (
        <Container>
          <WrittingTop />
          <WrittingMiddle>
            <div>
              <div>
                <Avatar
                  onClick={() =>
                    navigate(`/profile/${feedData.seeFeed.user.id}`)
                  }
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                  url={feedData.seeFeed.user.avatar}
                />
                <div>
                  <span>{feedData.seeFeed.user.username}</span>
                  <div style={{ marginTop: "5px", marginLeft: "-5px" }}>
                    <span>
                      <FontAwesomeIcon
                        style={{ opacity: "0.7" }}
                        icon={faClock}
                      />{" "}
                      {calDate(feedData.seeFeed.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              {feedData.seeFeed.user.id === myData?.myProfile?.id ? (
                <span
                  onClick={() => onFeedDelete(feedData.seeFeed.id)}
                  style={{
                    color: "#d35050",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </span>
              ) : null}
            </div>
            <div>{feedData.seeFeed.title}</div>
            <Photo url={feedData.seeFeed.avatar} />
            <div>{feedData.seeFeed.text}</div>
          </WrittingMiddle>
          <WrittingBottom>
            {myData ? (
              <Form onSubmit={handleSubmit(onTextSubmit)}>
                <Textarea {...register("text", { required: true })} />
                <button
                  disabled={loading.loading ? true : false}
                  style={{ opacity: loading.loading ? "0.5" : "1" }}
                >
                  댓글쓰기
                </button>
              </Form>
            ) : null}
            {feedData.seeFeed.comments.map((value: any, index: number) => (
              <Comment key={index}>
                <div>
                  <div>
                    <Avatar
                      onClick={() => navigate(`/profile/${value.user.id}`)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                      url={value.user.avatar}
                    />
                    <div>
                      <span>{value.user.username}</span>
                      <div style={{ marginTop: "5px", marginLeft: "-5px" }}>
                        <span>
                          <FontAwesomeIcon
                            style={{ opacity: "0.7" }}
                            icon={faClock}
                          />{" "}
                          {calDate(value.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {value.user.id === myData?.myProfile?.id ? (
                    <span
                      onClick={() => onCommentDelete(value.id)}
                      style={{
                        color: "#d35050",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </span>
                  ) : null}
                </div>
                <div>{value.text}</div>
              </Comment>
            ))}
          </WrittingBottom>
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Writting;
