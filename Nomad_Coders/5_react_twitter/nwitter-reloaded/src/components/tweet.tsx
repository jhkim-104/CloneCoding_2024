import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 2fr 1fr;
  gap: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const ImageBtnWrapper = styled.div`
  width: 100%;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  & > * {
    width: 100%;
    border-radius: 5px;
  }
`;

const Column = styled.div`
  height: 100%;
`;
const RightAlignedColumn = styled.div`
  justify-self: end;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin: 0 10px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 5px;
  font-size: 18px;
`;

const EditMessage = styled.textarea`
  border: 0.5 solid rgba(255, 255, 255, 1);
  margin: 5px 0;
  padding: 5px 5px;
  border-radius: 5px;
  font-size: 18px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
  &:disabled {
    background-color: gray;
  }
`;
const IconButton = styled.div`
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

const TextButton = styled.button`
  cursor: pointer;
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: upperccase;
  &.delete {
    background-color: tomato;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isLoading, setLoading] = useState(false);
  const [currentTweet, setCurrentTweet] = useState(tweet);
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [isEditMode, setIsEditMode] = useState(false);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);
  const changeFileInputRef = useRef<HTMLInputElement | null>(null);
  const user = auth.currentUser;
  const curDoc = doc(db, "tweets", id);
  const onEditMode = () => {
    if (user?.uid !== userId) return; // 재확인
    setIsEditMode(true);
  };
  const onChangeTweet = async () => {
    if (tweet === currentTweet || user?.uid !== userId) {
      // 변경 사항 없거나 자신의 트윗이 아니면
      setIsEditMode(false);
      return;
    } else if (isLoading || currentTweet === "") {
      return; // 예외처리
    }

    try {
      setLoading(true);
      await updateDoc(curDoc, {
        tweet: currentTweet,
      });
    } catch (e) {
      console.log(e);
      setCurrentTweet(tweet); // 업데이트 실패 시 원상 복구
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  };
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return; // 재확인
    try {
      await deleteDoc(curDoc); // 삭제 요청
      if (currentPhoto) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      // await
    }
  };
  const onEditedTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTweet(e.target.value);
  };
  const onImageDelete = async () => {
    const ok = confirm("Are you sure you want to delete tweet image?");
    if (!ok || user?.uid !== userId || !currentPhoto || isLoading) return; // 재확인
    try {
      setLoading(true);
      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      await deleteObject(photoRef);
      await updateDoc(curDoc, {
        photo: deleteField(),
      });
      setCurrentPhoto(undefined);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const onAddFileButtonClick = () => {
    addFileInputRef?.current?.click();
  };
  const onUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files === null) {
      alert("Please Selecte valid file!!");
      return;
    } else if (files?.length !== 1) {
      alert("Please Selecte only one file!!");
      return;
    } else if (files[0].size > MAX_FILE_SIZE) {
      alert("Please select a file less than 1MB!!");
      return;
    }

    const file = files[0];
    if (user?.uid !== userId || !file || isLoading) {
      alert("Upload Failed");
      return; // 재확인
    }

    try {
      setLoading(true);
      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      const result = await uploadBytes(photoRef, file);
      const url = await getDownloadURL(result.ref);
      await updateDoc(curDoc, {
        photo: url,
      });
      setCurrentPhoto(url);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const onChangeImage = async () => {
    changeFileInputRef?.current?.click(); // 파일 업로드
  };
  const onChangeImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files === null) {
      alert("Please Selecte valid file!!");
      return;
    } else if (files?.length !== 1) {
      alert("Please Selecte only one file!!");
      return;
    } else if (files[0].size > MAX_FILE_SIZE) {
      alert("Please select a file less than 1MB!!");
      return;
    }

    const file = files[0];
    if (user?.uid !== userId || !file || isLoading) {
      alert("Upload Failed");
      return; // 재확인
    }

    try {
      setLoading(true);

      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      await deleteObject(photoRef); // 파일 삭제
      const result = await uploadBytes(photoRef, file); // 파일 업로드
      const url = await getDownloadURL(result.ref);

      await updateDoc(curDoc, {
        photo: url,
      });
      setCurrentPhoto(url);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditMode ? (
          <EditMessage
            maxLength={180}
            rows={3}
            onChange={onEditedTweetChange}
            value={currentTweet}
            disabled={isLoading}
          />
        ) : (
          <Payload>{currentTweet}</Payload>
        )}
      </Column>
      <Column>
        {currentPhoto ? <Photo src={currentPhoto} /> : null}
        {user?.uid === userId ? (
          currentPhoto ? (
            <ImageBtnWrapper>
              <TextButton onClick={onChangeImage}>Change Image</TextButton>
              <AttachFileInput
                ref={changeFileInputRef}
                onChange={onChangeImageFile}
                type="file"
                accept="image/*"
              />
              <TextButton onClick={onImageDelete} className="delete">
                Delete Image
              </TextButton>
            </ImageBtnWrapper>
          ) : (
            <ImageBtnWrapper>
              <IconButton onClick={onAddFileButtonClick}>
                <svg
                  data-slot="icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
                  />
                </svg>
              </IconButton>
              <AttachFileInput
                ref={addFileInputRef}
                onChange={onUploadImageFile}
                type="file"
                accept="image/*"
              />
            </ImageBtnWrapper>
          )
        ) : null}
      </Column>
      <RightAlignedColumn>
        {user?.uid === userId ? (
          <>
            <IconButton onClick={isEditMode ? onChangeTweet : onEditMode}>
              {isEditMode ? (
                <svg
                  data-slot="icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  />
                </svg>
              ) : (
                <svg
                  data-slot="icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                </svg>
              )}
            </IconButton>

            <IconButton onClick={onDelete} className="tweet-delete">
              <svg
                data-slot="icon"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                />
              </svg>
            </IconButton>
          </>
        ) : null}
      </RightAlignedColumn>
    </Wrapper>
  );
}
