import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'
import { colors } from '@/styles/colors'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StatusBar, View } from 'react-native'

export default function Register() {
  const EVENT_ID = '6df5f569-3e63-4449-92d8-e91fefd16c8f'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert('Inscrição', 'Preencha todos os campos!')
      }

      setIsLoading(true)

      const response = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      })

      const attendeeId = response.data.attendeeId

      if (attendeeId) {
        const response = await api.get(`/attendees/${attendeeId}/badge`)

        const badge = response.data.badge

        badgeStore.save(badge)

        Alert.alert('Inscrição', 'Inscrição realizada com sucesso!', [
          {
            text: 'Ok',
            onPress: () => router.push('/ticket'),
          },
        ])
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes('already registered')
        ) {
          return Alert.alert('Inscrição', 'Este e-mail já está cadastrado!')
        }
      }

      Alert.alert('Inscrição', 'Não foi possivel fazer a inscrição')
    }
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
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
          />
        </Input>
        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </Input>
        <Button
          text="Realizar inscrição"
          isLoading={isLoading}
          onPress={handleRegister}
        />
        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}
