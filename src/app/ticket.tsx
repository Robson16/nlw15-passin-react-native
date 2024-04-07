import { Button } from '@/components/button'
import { Credential } from '@/components/credential'
import { Header } from '@/components/header'
import { QRCode } from '@/components/qrcode'
import { useBadgeStore } from '@/store/badge-store'
import { colors } from '@/styles/colors'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Redirect } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Text,
  View,
} from 'react-native'

export default function Ticket() {
  const [isQRCodeExpanded, setIsQRCodeExpanded] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      })

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Foto', 'Não foi possivel selecionar a imagem.')
    }
  }

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        })
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Compartilhar', 'Não foi possivel compartilhar.')
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsHorizontalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onExpandQRCode={() => setIsQRCodeExpanded(true)}
        />
        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: 10 }}
          transition={{ loop: true, type: 'timing', duration: 700 }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>
        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>
        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do{' '}
          {badgeStore.data.eventTitle}
        </Text>
        <Button text="Compartilhar" onPress={handleShare} />
        <Pressable className="mt-10" onPress={() => badgeStore.remove()}>
          <Text className="text-base text-white font-bold text-center">
            Remover ingresso
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isQRCodeExpanded}
        statusBarTranslucent
        animationType="fade"
      >
        <View className="flex-1 bg-green-500 items-center justify-center">
          <Pressable onPress={() => setIsQRCodeExpanded(false)}>
            <QRCode value={badgeStore.data.checkInURL} size={300} />
            <Text className="font-body text-orange-500 text-sm text-center mt-10">
              Fechar
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}
