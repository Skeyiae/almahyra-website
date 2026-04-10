"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), { 
    ssr: false,
    loading: () => null // Don't show anything during SSR/loading
});

export default function ClientOnlyChatbot(props: any) {
    return <Chatbot {...props} />;
}
