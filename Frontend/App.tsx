import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { useState } from "react";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <View style={tw`flex-1 justify-center items-center bg-white`}>
            <Text style={tw`text-xl text-blue-600 font-bold`}>
                Ciao Beatrice sei bellissima e intelligemte non c e nessuno come te !
            </Text>
            <Text style={tw`mt-2 text-base text-gray-600`}>You clicked {count} times</Text>
            <Pressable onPress={() => setCount(count + 1)} style={tw`mt-4 px-4 py-2 bg-blue-500 rounded`}>
                <Text style={tw`text-white font-semibold`}>Click Me</Text>
            </Pressable>
        </View>
    );
}
