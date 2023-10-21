# Introduction
Welcome to our project, which leverages the power of ChatGPT to provide a highly efficient and customizable text transformation tool. This tool is specifically designed to address common coding scenarios where large volumes of text need to be refactored or reformatted. It is especially beneficial for software developers working with languages like C#.

# Features

## Unlimited Prompt Text Input to ChatGPT
- **Purpose**: This feature allows for the limitless input of prompt text into ChatGPT, primarily for handling large volumes of text transformations.
  
- **Use-Case Example**: Let's say you have a C# class like the one below, which requires transformations such as adding `JsonPropertyName` attributes, following the UpperCamelCase naming convention, and adding summary comments in Traditional Chinese.

    ```csharp
    public class Rootobject
    {
        public int code { get; set; }
        public string message { get; set; }
        public Data data { get; set; }
    }
    ```

    You can use a prompt like:

    ```markdown
    Add a JsonPropertyAttribute to each C# property. Ensure the JsonPropertyName matches the original property name. Rename C# properties to follow UpperCamelCase naming conventions. Add summary tags for the class and all its properties, using Traditional Chinese in the summaries.
    ```

    The transformed output will be:

    ```csharp
    /// <summary>
    /// 表示根物件。
    /// </summary>
    public class Rootobject
    {
        /// <summary>
        /// 狀態碼。
        /// </summary>
        [JsonPropertyName("code")]
        public int Code { get; set; }

        /// <summary>
        /// 訊息。
        /// </summary>
        [JsonPropertyName("message")]
        public string Message { get; set; }

        /// <summary>
        /// 資料。
        /// </summary>
        [JsonPropertyName("data")]
        public Data Data { get; set; }
    }
    ```

    With this feature, you can transform multiple C# classes at once, as long as they are included in the initial prompt.

# Usage

## Handling Long Prompts
When your prompt text exceeds 300 characters, an `UnlimitedText` button will appear on the interface. Clicking this button will initiate a continuous processing mode for handling long text inputs.

- **Step 1**: Input your prompt text into the text box.
- **Step 2**: If your text exceeds 300 characters, the `UnlimitedText` button will become visible.
- **Step 3**: Click the `UnlimitedText` button to start the transformation.

This is particularly useful when you have large volumes of code or text that need to be transformed based on a lengthy prompt.