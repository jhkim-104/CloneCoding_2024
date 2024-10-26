import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow: scroll;
`;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      // 유저가 컴포넌트를 보지 않을 경우 구독 취소 설정
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
