import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import EditableText from "../components/editable-text";
import EditIconButton from "../components/edit-icon-button";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const NameWrapper = styled.div`
  display: flex;
  gap: 5px;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(user?.displayName ?? "Annoymous");
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const onAvatarchange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
      setAvatar(avatarUrl);
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  const onEditUserNameStart = async () => {
    setIsEditMode(true);
  };

  const onEditUserNameFinish = async () => {
    if (!user || user.displayName === userName) {
      setIsEditMode(false);
      return;
    }
    setIsLoading(true);
    await updateProfile(user, {
      displayName: userName,
    });
    setIsLoading(false);
    setIsEditMode(false);
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarchange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <NameWrapper>
        <EditableText
          fontSize={22}
          rows={1}
          maxLength={40}
          isEditMode={isEditMode}
          currentText={userName}
          onTextChange={setUserName}
          isLoading={isLoading}
        />
        <EditIconButton
          isEditMode={isEditMode}
          onStartEdit={onEditUserNameStart}
          onFinishEdit={onEditUserNameFinish}
        />
      </NameWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
