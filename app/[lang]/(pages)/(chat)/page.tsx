"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

import { useState } from "react";
import Blank from "./blank";
import { deleteMessage } from "./chat-config";
import ContactList from "./contact-list";
import MessageFooter from "./message-footer";
import MessageHeader from "./message-header";
import Messages from "./messages";

import { messageService } from "@/app/api/services/message.Service";
import { roomService } from "@/app/api/services/room.Service";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn, decodedAccessUser } from "@/lib/utils";
import { RoomModel } from "@/models/room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SearchMessages from "./contact-info/search-messages";
import EmptyMessage from "./empty-message";
import Loader from "./loader";
import MyProfileHeader from "./my-profile-header";
import PinnedMessages from "./pin-messages";
import { MessageModel } from "@/models/message";
const ChatPage = () => {
  const limit = 10;
  const previousScrollPosition = useRef<number>(0);
  const profileData = useCurrentUser();
  const chatHeightRef = useRef<HTMLDivElement | null>(null);
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_IO_URL;
  const queryClient = useQueryClient();
  // Memoize getMessages using useCallback
  const getMessagesCallback = useCallback(
    (chatId: any) => messageService.getByRoomId(chatId, limit, 0),
    []
  );

  const [offset, setOffset] = useState<number>(0);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<any | null>(
    "000000000000000000000001"
  );
  const [showContactSidebar, setShowContactSidebar] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  // search state
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
  // Forward State
  const [isForward, setIsForward] = useState<boolean>(false);

  // reply state
  // const [replay, setReply] = useState<boolean>(false);
  // const [replayData, setReplyData] = useState<any>({});

  const {
    isLoading,
    isError,
    data: rooms,
    error,
    refetch: refetchContact,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomService.getAll(),
  });

  const {
    isLoading: messageLoading,
    isError: messageIsError,
    data: chats,
    error: messageError,
    refetch: refetchMessage,
  } = useQuery({
    queryKey: ["message", selectedChatId],
    queryFn: () =>
      selectedChatId
        ? getMessagesCallback(selectedChatId)
        : Promise.resolve(null),
  });
  // const {
  //   isLoading: profileLoading,
  //   isError: profileIsError,
  //   // data: profileData,
  //   error: profileError,
  //   refetch: refetchProfile,
  // } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: () => getProfile(),
  // });
  // const deleteMutation = useMutation({
  //   mutationFn: deleteMessage,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["messages"] });
  //   },
  // });

  const onDelete = (selectedChatId: string, index: string) => {
    if (socket) {
      socket.emit("deleteMessage", {
        RoomID: selectedChatId,
        MessageID: index,
      });
    }
  };

  const onEdit = (selectedChatId: string, index: string, content: string) => {
    if (socket) {
      socket.emit("editMessage", {
        RoomID: selectedChatId,
        MessageID: index,
        Content: content,
      });
    }
  };

  const openChat = (chatId: any) => {
    setSelectedChatId(chatId);
    // setReply(false);
    if (showContactSidebar) {
      setShowContactSidebar(false);
    }
  };
  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };
  const handleSendMessage = (message: any) => {
    if (!selectedChatId || !message) return;

    if (socket && profileData && profileData.id) {
      const user = decodedAccessUser();
      if (!user) return;
      socket.emit("sendMessage", {
        RoomID: selectedChatId,
        Content: message,
        Sender: user,
      });
    }
  };
  const handleScroll = async () => {
    if (
      chatHeightRef.current &&
      chatHeightRef.current.scrollTop === 0 &&
      hasMoreMessages
    ) {
      previousScrollPosition.current = chatHeightRef.current.scrollHeight;
      const newOffset = offset + limit;
      const newMessages = await messageService.getByRoomId(
        selectedChatId,
        limit,
        newOffset
      );
      if (
        newMessages &&
        newMessages.data &&
        Array.isArray(newMessages.data.data)
      ) {
        if (newMessages.data.data.length < limit) {
          setHasMoreMessages(false);
        }
        queryClient.setQueryData(
          ["message", selectedChatId],
          (oldMessages: any) => {
            if (
              !oldMessages ||
              !oldMessages.data ||
              !Array.isArray(oldMessages.data.data)
            ) {
              return {
                data: {
                  data: [...newMessages.data.data],
                },
              };
            }
            return {
              ...oldMessages,
              data: {
                ...oldMessages.data,
                data: [...newMessages.data.data, ...oldMessages.data.data],
              },
            };
          }
        );
        setOffset(newOffset);
        setTimeout(() => {
          if (chatHeightRef.current) {
            chatHeightRef.current.scrollTop =
              chatHeightRef.current.scrollHeight -
              previousScrollPosition.current;
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const chatContainer = chatHeightRef.current;

    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [offset, hasMoreMessages, selectedChatId]);

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [handleSendMessage, rooms]);
  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [pinnedMessages]);
  useEffect(() => {
    if (!selectedChatId) return;
    const newSocket = io(socketUrl as string, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      setConnectionStatus("Bağlandı");
    });
    newSocket.on("disconnect", () => {
      setConnectionStatus("Bağlanamadı");
    });
    newSocket.on("connect_error", (error) => {
      setConnectionStatus(`Bağlantı Hatası: ${error.message}`);
    });

    newSocket.on("message", (newMessage: any) => {
      queryClient.setQueryData(
        ["message", selectedChatId],
        (oldMessages: any) => {
          // Eğer oldMessages null veya tanımsız ise yeni bir array döndür
          if (
            !oldMessages ||
            !oldMessages.data ||
            !Array.isArray(oldMessages.data.data)
          ) {
            return {
              data: {
                data: [newMessage], // Yeni mesajı array içine koy
              },
            };
          }
          // Yeni mesajı mevcut mesajların sonuna ekle
          return {
            ...oldMessages, // Eski mesajları koru
            data: {
              ...oldMessages.data,
              data: [...oldMessages.data.data, newMessage], // Yeni mesajı ekle
            },
          };
        }
      );
    });

    newSocket.on("delete_message", (deletedObj: any) => {
      const { MessageID, RoomID } = deletedObj;
      queryClient.setQueryData(["message", RoomID], (oldMessages: any) => {
        // Eğer oldMessages null veya tanımsız ise bir şey yapma
        if (
          !oldMessages ||
          !oldMessages.data ||
          !Array.isArray(oldMessages.data.data)
        ) {
          return oldMessages; // Eğer eski mesajlar yoksa aynı veriyi geri döndür
        }

        // Mevcut mesajlardan silinmesi gerekeni ayıklayın
        const updatedMessages = oldMessages.data.data.map(
          (message: MessageModel) => {
            if (message.ID === MessageID) {
              return {
                ...message,
                Content: "", // Mesaj içeriğini boş yap
                Attachment: {},
                RepliedMessage: {},
                DeletedAt: new Date().toISOString(), // deletedAt alanını şu anki tarih ile güncelle
              };
            }
            return message; // Diğer mesajlar aynı kalsın
          }
        );

        // Yeni mesaj listesini döndürün
        return {
          ...oldMessages,
          data: {
            ...oldMessages.data,
            data: updatedMessages, // Güncellenmiş mesaj listesini burada set ediyoruz
          },
        };
      });
    });

    newSocket.on("edit_message", (editedObj: any) => {
      const { EditedMessage, MessageID, RoomID } = editedObj;
      queryClient.setQueryData(["message", RoomID], (oldMessages: any) => {
        if (
          !oldMessages ||
          !oldMessages.data ||
          !Array.isArray(oldMessages.data.data)
        ) {
          return oldMessages; // Eğer eski mesajlar yoksa aynı veriyi geri döndür
        }

        // Mevcut mesajlardan silinmesi gerekeni ayıklayın
        const updatedMessages = oldMessages.data.data.map(
          (message: MessageModel) => {
            if (message.ID === MessageID) {
              return {
                ...message,
                Content: EditedMessage, // Mesaj içeriğini boş yap
                UpdatedAt: new Date().toISOString(),
              };
            }
            return message; // Diğer mesajlar aynı kalsın
          }
        );

        // Yeni mesaj listesini döndürün
        return {
          ...oldMessages,
          data: {
            ...oldMessages.data,
            data: updatedMessages, // Güncellenmiş mesaj listesini burada set ediyoruz
          },
        };
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // handle search bar
  const handleSetIsOpenSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };
  // handle pin note

  const handlePinMessage = (note: any) => {
    const updatedPinnedMessages = [...pinnedMessages];

    const existingIndex = updatedPinnedMessages.findIndex(
      (msg) => msg.note === note.note
    );

    if (existingIndex !== -1) {
      updatedPinnedMessages.splice(existingIndex, 1); // Remove the message
      //setIsPinned(false);
    } else {
      updatedPinnedMessages.push(note); // Add the message
      // setIsPinned(true);
    }

    setPinnedMessages(updatedPinnedMessages);
  };

  const handleUnpinMessage = (pinnedMessage: any) => {
    // Create a copy of the current pinned messages array
    const updatedPinnedMessages = [...pinnedMessages];

    // Find the index of the message to unpin in the updatedPinnedMessages array
    const index = updatedPinnedMessages.findIndex(
      (msg) =>
        msg.note === pinnedMessage.note && msg.avatar === pinnedMessage.avatar
    );

    if (index !== -1) {
      // If the message is found in the array, remove it (unpin)
      updatedPinnedMessages.splice(index, 1);
      // Update the state with the updated pinned messages array
      setPinnedMessages(updatedPinnedMessages);
    }
  };

  // Forward handle
  const handleForward = () => {
    setIsForward(!isForward);
  };
  const isLg = useMediaQuery("(max-width: 1024px)");
  return (
    <div className="flex gap-5 app-height  relative rtl:space-x-reverse">
      {isLg && showContactSidebar && (
        <div
          className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
          onClick={() => setShowContactSidebar(false)}
        ></div>
      )}
      {isLg && showInfo && (
        <div
          className=" bg-background/60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-40 rounded-md"
          onClick={() => setShowInfo(false)}
        ></div>
      )}
      <div
        className={cn("transition-all duration-150 flex-none  ", {
          "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]": isLg,
          "flex-none min-w-[260px]": !isLg,
          "left-0": isLg && showContactSidebar,
          "-left-full": isLg && !showContactSidebar,
        })}
      >
        <Card className="h-full pb-0">
          <CardHeader className="border-none pb-0 mb-0">
            <MyProfileHeader profile={profileData} />
          </CardHeader>
          <CardContent className="pt-0 px-0   lg:h-[calc(100%-170px)] h-[calc(100%-70px)]   ">
            <ScrollArea className="h-full">
              {isLoading ? (
                <Loader />
              ) : (
                rooms?.data?.map((room: RoomModel) => (
                  <ContactList
                    key={room.ID}
                    room={room}
                    selectedChatId={selectedChatId}
                    openChat={openChat}
                  />
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {/* chat sidebar  end*/}
      {/* chat messages start */}
      {selectedChatId ? (
        <div className="flex-1 ">
          <div>{connectionStatus}</div>
          <div className=" flex space-x-5 h-full rtl:space-x-reverse">
            <div className="flex-1">
              <Card className="h-full flex flex-col ">
                <CardHeader className="flex-none mb-0">
                  <MessageHeader
                    showInfo={showInfo}
                    handleShowInfo={handleShowInfo}
                    profile={profileData}
                    mblChatHandler={() =>
                      setShowContactSidebar(!showContactSidebar)
                    }
                  />
                </CardHeader>
                {isOpenSearch && (
                  <SearchMessages
                    handleSetIsOpenSearch={handleSetIsOpenSearch}
                  />
                )}

                <CardContent className=" !p-0 relative flex-1 overflow-y-auto">
                  <div
                    className="h-full py-4 overflow-y-auto no-scrollbar"
                    ref={chatHeightRef}
                  >
                    {messageLoading ? (
                      <Loader />
                    ) : (
                      <>
                        {messageIsError ? (
                          <EmptyMessage />
                        ) : (
                          chats?.data?.data?.map(
                            (message: MessageModel, i: number) => (
                              <Messages
                                key={`message-list-${i}`}
                                message={message}
                                contact={chats?.contact}
                                profile={profileData}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                index={message.ID}
                                selectedChatId={selectedChatId}
                                // handleReply={handleReply}
                                // replayData={replayData}
                                handleForward={handleForward}
                                handlePinMessage={handlePinMessage}
                                pinnedMessages={pinnedMessages}
                              />
                            )
                          )
                        )}
                      </>
                    )}
                    <PinnedMessages
                      pinnedMessages={pinnedMessages}
                      handleUnpinMessage={handleUnpinMessage}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-none flex-col px-0 py-4 border-t border-border">
                  <MessageFooter
                    handleSendMessage={handleSendMessage}
                    // replay={replay}
                    // setReply={setReply}
                    // replayData={replayData}
                  />
                </CardFooter>
              </Card>
            </div>

            {/* {showInfo && (
              <ContactInfo
                handleSetIsOpenSearch={handleSetIsOpenSearch}
                handleShowInfo={handleShowInfo}
                contact={contacts?.contacts?.find(
                  (contact: ContactType) => contact.id === selectedChatId
                )}
              />
            )} */}
          </div>
        </div>
      ) : (
        <Blank mblChatHandler={() => setShowContactSidebar(true)} />
      )}
      {/* <ForwardMessage
        open={isForward}
        setIsOpen={setIsForward}
        contacts={contacts}
      /> */}
    </div>
  );
};

export default ChatPage;
