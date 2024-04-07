import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native'

interface ButtonProps extends PressableProps {
  text: string
  isLoading?: boolean
}

export function Button({ text, isLoading = false, ...rest }: ButtonProps) {
  return (
    <Pressable
      disabled={isLoading}
      className="w-full h-14 bg-orange-500 flex items-center justify-center rounded-lg"
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator className="text-green-500" />
      ) : (
        <Text className="text-green-500 text-base font-bold uppercase">
          {text}
        </Text>
      )}
    </Pressable>
  )
}
