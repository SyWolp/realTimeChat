import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { ChakraProvider } from "@chakra-ui/react";
Amplify.configure(awsExports);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
