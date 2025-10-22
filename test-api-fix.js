// 测试API修复的脚本
// 在浏览器控制台或Node.js环境中运行

const testApi = async () => {
  console.log("🧪 开始测试API修复效果...");

  // 测试1: 检查API响应格式
  try {
    console.log("📍 测试1: 检查text_to_image API响应格式");

    const testData = {
      model: "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      prompt: "warm birthday card with text: 'Happy Birthday!', creative typography, celebration theme, high quality design",
      width: 1024,
      height: 1024,
      output_format: "png",
      aspect_ratio: "custom",
      user_id: "test-user",
      user_email: "test@example.com",
      effect_link_name: "birthday-card",
      credit: 1
    };

    const response = await fetch("/api/predictions/text_to_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API返回错误:", errorText);
      return false;
    }

    const responseText = await response.text();
    console.log("Response text length:", responseText.length);
    console.log("Response text preview:", responseText.substring(0, 200) + "...");

    if (!responseText) {
      console.error("❌ API返回空响应");
      return false;
    }

    let prediction;
    try {
      prediction = JSON.parse(responseText);
      console.log("✅ JSON解析成功");
      console.log("Prediction ID:", prediction.id);
      console.log("Prediction status:", prediction.status);
      return true;
    } catch (jsonError) {
      console.error("❌ JSON解析失败:", jsonError);
      console.error("响应内容:", responseText);
      return false;
    }

  } catch (error) {
    console.error("❌ 测试失败:", error);
    return false;
  }
};

// 测试2: 检查错误处理
const testErrorHandling = async () => {
  console.log("📍 测试2: 检查错误处理");

  try {
    // 测试无效JSON
    const response = await fetch("/api/predictions/text_to_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "invalid json {",
    });

    const result = await response.text();
    console.log("无效JSON测试 - Status:", response.status);
    console.log("无效JSON测试 - Response:", result);

    if (response.status === 400 && result.includes("Invalid JSON")) {
      console.log("✅ 无效JSON错误处理正确");
    } else {
      console.log("❌ 无效JSON错误处理有问题");
    }

  } catch (error) {
    console.error("❌ 错误处理测试失败:", error);
  }
};

// 运行测试
const runTests = async () => {
  console.log("🚀 开始API修复测试\n");

  const test1 = await testApi();
  console.log("");

  await testErrorHandling();
  console.log("");

  if (test1) {
    console.log("🎉 API修复测试通过！JSON解析问题已解决。");
  } else {
    console.log("⚠️ 仍需进一步调试API问题。");
  }
};

// 如果在浏览器中运行，可以直接调用
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.testApiFix = runTests;
  console.log("在浏览器控制台中运行: testApiFix()");
} else {
  // Node.js环境 (需要适当的fetch polyfill)
  runTests();
}