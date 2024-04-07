import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'
import { colors } from '@/styles/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, Redirect } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StatusBar, View } from 'react-native'

export default function Home() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleAccessCredential() {
    try {
      if (!code.trim()) {
        return Alert.alert('Ingresso', 'Informe o codigo do ingresso')
      }

      setIsLoading(true)

      const response = await api.get(`/attendees/${code}/badge`)

      const badge = response.data.badge

      badgeStore.save(badge)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      Alert.alert('Credencial', 'Credencial não encontrada!')
    }
  }

  if (badgeStore.data?.checkInURL) {
    return <Redirect href="/ticket" />
  }

  return (
    <View className="flex-1 items-center justify-center p-8 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Image
        source={require('@/assets/logo.png')}
        alt="NLW Unite"
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field placeholder="Digite aqui..." onChangeText={setCode} />
        </Input>
        <Button
          text="Acessar credencial"
          isLoading={isLoading}
          onPress={handleAccessCredential}
        />
        <Link
          href="/register"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Ainda não possui ingresso?
        </Link>
      </View>
    </View>
  )
}
