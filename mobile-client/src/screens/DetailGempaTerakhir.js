import React from 'react'
import { View } from 'react-native'
import { Box, Spinner, Heading, AspectRatio, Text, Center, HStack, Stack, NativeBaseProvider, Divider, Flex} from "native-base";
import { useEffect, useState } from 'react';
import { formatDistance, subHours} from 'date-fns'
import {Feather, Ionicons} from 'react-native-vector-icons';
import MapView, {Callout, Marker }  from 'react-native-maps';
import { useQuery } from '@apollo/client';
import { GET_USER_REPORT_GEMPA } from '../../lib/apollo/queries/eqQuery';
import {Svg, Image as ImageSvg} from 'react-native-svg';

const LinearGradient = require("expo-linear-gradient").LinearGradient;

const config = {
  dependencies: {
    "linear-gradient": LinearGradient
  }
};

export default function DetailGempaTerakhir({route}) {
  const item = route.params.item

  let coor
  let time
  let ltd
  let lng
  if(item) {
    coor = item.coordinates
    time = item.dateTime
    const a =  item.coordinates
    const b = a.split(',')
    ltd = Number(b[0])
    lng = Number(b[1])
  }

  const { loading: loading1, error: error1, data: data1 } = useQuery(GET_USER_REPORT_GEMPA, {
    variables: {
      coordinates: coor, 
      dateTime: time
    }
  })

  let markers
  if(data1) {
    markers = data1.getEqReports
  }

  let numberOfMarkers
  if(markers) {
    numberOfMarkers = markers.length; 
  }
  const [markerRefs, setMarkerRefs] = useState([]);

  useEffect(() => {
    setMarkerRefs((markerRefs) =>
      Array(numberOfMarkers)
        .fill()
        .map((_, i) => markerRefs[i] || React.createRef())
    );
  }, [numberOfMarkers ])

  const [date, setDate] = useState('')
  useEffect(() => {
    const time = formatDistance(subHours(new Date(item.dateTime), 3), new Date(), { addSuffix: true })
    setDate(time)
  }, [])

  return (
    <NativeBaseProvider  config={config}>
      {
        loading1 ?
        <Center flex={1} px="3">
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="emerald.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Center>
        :

      <Center flex={1} px="3" bg="#e4e4e7">
        <Box borderWidth={2} rounded="md" borderColor="#f97316">
          <AspectRatio w="100%" ratio={4/4}>
            {
              data1 ?
              <MapView
                initialRegion={{
                  latitude: ltd,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                >
                  <Marker 
                  coordinate={{
                    latitude: ltd,
                    longitude: lng,
                  }}
                  pinColor="red"
                  >
                    <Callout><Text>Pusat Gempa</Text></Callout>
                  </Marker>
                  
                  {markers?.map((marker, index) => (
                    <Marker
                      key={index}
                      coordinate={{ latitude : Number(marker.coordinate.split(',')[0]) , longitude : Number(marker.coordinate.split(',')[1]) }}
                      description={marker.description}
                      pinColor="green"
                      ref={markerRefs[index]}
                      onPress={() => {
                        setTimeout(() => {
                          markerRefs[index].current.hideCallout();
                          markerRefs[index].current.showCallout();
                        }, 200);
                      }}
                    >
                      <Callout>
                        <Svg width={240} height={120}>
                            <ImageSvg
                                width={'100%'} 
                                height={'100%'}
                                preserveAspectRatio="xMidYMid slice"
                                href={{ uri: marker.photoUrl}}
                            />
                        </Svg>
                        <Text>User : {marker.User.email}</Text>
                        <Text>Status : {marker.status}</Text>
                        <Text>Keterangan : {marker.description}</Text>
                        <Text>Cordinate : {marker.coordinate}</Text>
                      </Callout>
                    </Marker>
                  ))}
              </MapView>
              :
              <MapView
                initialRegion={{
                    latitude: ltd,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                >
                  <Marker 
                  coordinate={{
                      latitude: ltd,
                    longitude: lng,
                  }}
                  pinColor="red"
                  >
                    <Callout><Text>Pusat Gempa</Text></Callout>
                  </Marker>
              </MapView>
          }

          </AspectRatio>
        </Box>

        <Box alignItems="center" mt="2">
          <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" 
            bg={{
              linearGradient: {
                colors: ["#191645", "#43C6AC"],
                start: [0, 0],
                end: [0, 1]
              }
            }}   _text={{
              fontSize: "md",
              fontWeight: "bold",
              color: "white"
            }}>
            <Stack p="4" space={3}>
              <Box alignItems="center">
                <Box w="100%">
                  <Flex mx="1" direction="row" justify="space-evenly" h="50">
                    <View justifyContent="center" alignItems="center">
                      <Text fontSize="xs" color="#fff">{item.hour}</Text>
                      <Heading size="md" color="#fff">{item.date}</Heading>
                      <Text fontSize="xs" color="#fff">{date}</Text>
                    </View >
                    <Divider orientation="vertical" bg="#a1a1aa" thickness="2" mx="7" />
                    <View justifyContent="center" alignItems="center">
                      <Feather color="#dc2626" name="activity" />
                      <Heading size="md" color="#fff">{item.magnitude}</Heading>
                      <Text color="#fff">Magnitude</Text>
                    </View>
                    <Divider orientation="vertical" bg="#a1a1aa" thickness="2" mx="7" />
                    <View justifyContent="center" alignItems="center">
                      <Feather color="#fbbf24" name="radio" />
                      <Heading size="sm" color="#fff">{item.depth}</Heading>
                      <Text color="#fff">Kedalaman</Text>
                    </View>
                  </Flex>
                  <Divider mt="4" mb="2" bg="#a1a1aa" thickness="2" />
                  <View m="2">
                    <Ionicons color="#f97316" name="location"><Text fontSize="xs" color="#fff"> {item.area}</Text></Ionicons>
                    <Ionicons  color="#fde047" name="map"><Text fontSize="xs" color="#fff"> (skala MMI) dirasakan pada Wilayah : {item.dirasakan}</Text></Ionicons>
                  </View>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Center>
      }
    </NativeBaseProvider>
  )
}