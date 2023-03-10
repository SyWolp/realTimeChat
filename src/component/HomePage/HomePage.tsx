import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import { listChats } from "../../graphql/queries";
import { createChat } from "../../graphql/mutations";
import { onCreateChat } from "@/graphql/subscriptions";
export default function Home(): JSX.Element {
  const [chatData, setChatData] = useState<any>([]);
  const [sortData, setSortData] = useState<any>([]);
  const [createChatData, setCreateChatData] = useState<any>({
    text: "",
    author: "",
  });

  const fetchChat = async () => {
    const data: any = await API.graphql(graphqlOperation(listChats));
    setChatData(data?.data?.listChats?.items);
  };

  const onSubmit = async (Event: any) => {
    Event.preventDefault();
    await API.graphql(
      graphqlOperation(createChat, {
        input: createChatData.author
          ? createChatData
          : { author: "익명", text: createChatData.text },
      }),
    );
    setCreateChatData({ author: "", text: "" });
  };

  const realTimeChat = async () => {
    const anyAPI: any = await API.graphql(graphqlOperation(onCreateChat));
    anyAPI.subscribe({
      next: ({ value: { data } }: any) =>
        // console.log(chatData, data.onCreateChat),
        setChatData((prev: any) => [{ ...data.onCreateChat }, ...prev]),
    });
  };
  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    realTimeChat();
  }, []);

  useEffect(() => {
    const sortChat = [...chatData];
    sortChat.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setSortData(sortChat);
  }, [chatData]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      height={"container.sm"}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        h={"100%"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Flex
          border={"1px"}
          w={"90%"}
          height={"80%"}
          m={"auto"}
          flexDir={"column"}
          overflowY={"scroll"}
        >
          {sortData?.map((v: any) => {
            return (
              <Flex key={v.id}>
                <Text mx={2} my={1}>
                  {v.author} :
                </Text>
                <Text mx={2} my={1}>
                  {v.text}
                </Text>
              </Flex>
            );
          })}
        </Flex>
        <Flex>
          <Input
            flex={1}
            placeholder="Your Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={createChatData.author}
            onChange={(e: any) =>
              setCreateChatData({
                text: createChatData.text,
                author: e.target.value,
              })
            }
          />

          <Input
            flex={2}
            placeholder="How are you Feelings"
            _placeholder={{ color: "gray.500" }}
            value={createChatData.text}
            type="text"
            onChange={(e: any) =>
              setCreateChatData({
                text: e.target.value,
                author: createChatData.author,
              })
            }
          />
        </Flex>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={(e) => onSubmit(e)}
          >
            send
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
