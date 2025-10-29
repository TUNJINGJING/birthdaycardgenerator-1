"use client";
import { useAppContext } from "@/contexts/app";
import { useEffect, useState } from "react";
import { EffectResultInfo } from "@/backend/type/domain/effect_result_info";
import {
  Pagination,
  Modal,
  Button,
  Spinner,
  ModalContent,
  ModalBody,
  Card,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import Image from "next/image";
export default function Dashboard() {
  const { user } = useAppContext();
  const [effectResults, setEffectResults] = useState<EffectResultInfo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedResult, setSelectedResult] = useState<EffectResultInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 9; // 改为9（3x3网格）
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const router = useRouter();
  const t = useTranslations("dashboard");
  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
  };

  const fetchResults = async (pageNum: number) => {
    if (!user?.uuid) return;

    setIsLoading(true);
    try {
      const results = await fetch(
        `/api/effect_result/list_by_user_id?user_id=${user.uuid}&page=${pageNum}&page_size=${pageSize}`
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch results");
        return res.json();
      });
      setEffectResults(results);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCount = async () => {
    if (!user?.uuid) return;

    try {
      const response = await fetch(
        `/api/effect_result/count_all?user_id=${user.uuid}`
      );
      if (!response.ok) throw new Error("Failed to fetch count");

      const data = await response.json();
      const count = parseInt(data.count);
      setTotalCount(count);
      const pages = Math.max(1, Math.ceil(count / pageSize));
      setTotalPages(pages);

      if (page > pages) {
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to fetch count:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      fetchUserSubscriptionInfo();
      await fetchCount();
      await fetchResults(page);
    };

    if (user?.uuid) {
      init();
    }
  }, [user?.uuid]);

  useEffect(() => {
    if (user?.uuid) {
      fetchResults(page);
      fetchUserSubscriptionInfo();
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleViewResult = (result: EffectResultInfo) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleDownload = (result: EffectResultInfo) => {
    if (!result.url) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.setAttribute("download", `birthday-card-${result.result_id}.png`);
    link.setAttribute("target", "_blank");
    link.click();
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    return new Date(date).toLocaleDateString();
  };

  const getCardStyle = (prompt: string): string => {
    if (!prompt) return "Birthday Card";

    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("warm") || lowerPrompt.includes("cozy") || lowerPrompt.includes("heartwarming")) {
      return "Warm";
    }
    if (lowerPrompt.includes("funny") || lowerPrompt.includes("playful") || lowerPrompt.includes("humorous")) {
      return "Funny";
    }
    if (lowerPrompt.includes("formal") || lowerPrompt.includes("elegant") || lowerPrompt.includes("sophisticated")) {
      return "Formal";
    }
    if (lowerPrompt.includes("cute") || lowerPrompt.includes("adorable") || lowerPrompt.includes("kawaii")) {
      return "Cute";
    }
    return "Birthday Card";
  };

  return (
    <div className="">
      <div className="container max-w-7xl mx-auto px-4 md:p-8 py-10 md:py-12 md:pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2">
            {t("title")}
          </h1>
        </div>

        {userSubscriptionInfo && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.remainingCredits")}
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.remain_count}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.planName")}
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.plan_name}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.periodStart")}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {new Date(
                      userSubscriptionInfo.current_period_start
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.periodEnd")}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.current_period_end
                      ? new Date(
                          userSubscriptionInfo.current_period_end
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 rounded-2xl">
            <Spinner size="lg" label={t("loading")} color="primary" />
          </div>
        ) : effectResults && effectResults.length > 0 ? (
          <>
            {/* 卡片网格布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {effectResults.map((result) => (
                <Card
                  key={result.result_id}
                  className="group hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-gray-700"
                >
                  <CardBody
                    className="p-0 overflow-hidden cursor-pointer"
                    onClick={() => handleViewResult(result)}
                  >
                    {/* 图片预览区域 */}
                    <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800">
                      {result.url && result.status === "succeeded" ? (
                        <img
                          src={result.url}
                          alt="Birthday Card"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon
                            icon="mdi:image-off"
                            className="text-gray-400"
                            width={64}
                          />
                        </div>
                      )}

                      {/* 悬浮遮罩 - hover时显示 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Icon
                          icon="mdi:eye"
                          className="text-white"
                          width={48}
                        />
                      </div>

                      {/* 状态标签 */}
                      {result.status !== "succeeded" && (
                        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                          {result.status}
                        </div>
                      )}
                    </div>

                    {/* 卡片信息区域 */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            {getCardStyle(result.prompt)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(result.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Prompt预览（截断） */}
                      {result.prompt && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
                          {result.prompt}
                        </p>
                      )}
                    </div>
                  </CardBody>

                  <CardFooter className="border-t border-blue-100 dark:border-gray-700 p-3">
                    <div className="flex gap-2 w-full">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="flex-1"
                        onPress={() => handleViewResult(result)}
                        startContent={<Icon icon="mdi:eye" width={18} />}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        className="flex-1"
                        onPress={() => handleDownload(result)}
                        isDisabled={!result.url || result.status !== "succeeded"}
                        startContent={<Icon icon="mdi:download" width={18} />}
                      >
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalCount > 0 && (
              <div className="flex justify-center mt-6 md:mt-8">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  showControls
                  className="gap-1 md:gap-2"
                  size="md"
                  color="primary"
                  variant="flat"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              {t("noResults")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              开始创建精彩的AI内容吧！
            </p>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedResult(null);
          }}
          size="2xl"
          className="mx-2"
          backdrop="blur"
        >
          <ModalContent className="bg-white dark:bg-gray-800">
            {selectedResult && (
              <ModalBody>
                <div className="p-2 md:p-4">
                  {!selectedResult.url ? (
                    <div className="text-center p-4">
                      <p className="text-gray-500 mb-2">
                        {t("modal.noContent")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("modal.effect")}: {selectedResult.effect_name} |{" "}
                        {t("modal.status")}: {selectedResult.status}
                      </p>
                    </div>
                  ) : selectedResult.effect_name === "chat-with-images" ? (
                    <div className="whitespace-pre-wrap text-xs md:text-base">
                      {selectedResult.url}
                    </div>
                  ) : // Check if the URL is a video file (by extension or effect name)
                  selectedResult.url.endsWith(".mp4") ||
                    selectedResult.url.endsWith(".webm") ||
                    selectedResult.url.endsWith(".mov") ||
                    selectedResult.effect_name === "ai-kissing-video" ||
                    selectedResult.effect_name === "text-to-video" ||
                    selectedResult.effect_name === "ai-dancing" ||
                    selectedResult.effect_name.includes("video") ||
                    selectedResult.effect_name.includes("dance") ? (
                    <video
                      src={selectedResult.url}
                      className="w-full h-auto rounded-lg shadow-lg"
                      controls
                      onError={(e) => {
                        console.error("Video load error:", e);
                        console.error("Video URL:", selectedResult.url);
                      }}
                    />
                  ) : (
                    <img
                      src={selectedResult.url}
                      alt="Result"
                      className="w-full h-auto rounded-lg shadow-lg"
                      loading="lazy"
                      onError={(e) => {
                        console.error("Image load error:", e);
                        console.error("Image URL:", selectedResult.url);
                      }}
                    />
                  )}
                </div>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
