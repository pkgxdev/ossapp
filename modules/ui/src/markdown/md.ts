import { marked } from "marked";

const defaultOptions = {
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: "",
  langPrefix: "language-",
  mangle: false,
  pedantic: false,
  sanitize: false,
  silent: false,
  smartLists: false,
  smartypants: false,
  xhtml: false
};

export const tokenizeMarkdown = (data: string) => {
  const tokens = marked.lexer(data, defaultOptions);

  try {
    const newTokens = preprocessHtmlTokens([...tokens]);
    return newTokens;
  } catch (err) {
    console.error("Failed to preprocess markdown html tokens", err);
    return tokens;
  }
};

const preprocessHtmlTokens = (tokens: marked.Token[]): marked.Token[] => {
  const processedTokens: marked.Token[] = [];
  let htmlTokens: marked.Tokens.HTML[] = [];

  // collapse all contiguous sibling html tokens.
  // fortunately html tokens cannot have child tokens so combining them is easier
  tokens.forEach((token: marked.Token) => {
    if (token.type === "html") {
      htmlTokens.push(token as marked.Tokens.HTML);
    } else {
      if (htmlTokens.length > 0) {
        processedTokens.push(combineHtmlTokens(htmlTokens));
        htmlTokens = [];
      }
      processedTokens.push(token);
    }
  });

  if (htmlTokens.length > 0) {
    processedTokens.push(combineHtmlTokens(htmlTokens));
    htmlTokens = [];
  }

  // after the list of tokens has been collapsed, delve into any nodes with children and preprocess them as well
  processedTokens.forEach((token: marked.Token) => {
    if ("tokens" in token && token.tokens?.length) {
      token.tokens = preprocessHtmlTokens(token.tokens);
    }
  });

  return processedTokens;
};

const combineHtmlTokens = (htmlTokens: marked.Tokens.HTML[]) => {
  return htmlTokens.reduce((acc, token) => {
    const raw = acc.raw + token.raw;
    const text = acc.text + token.text;
    return { ...acc, raw, text };
  });
};
