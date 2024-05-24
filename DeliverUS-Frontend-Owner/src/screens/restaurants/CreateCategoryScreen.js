/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Formik } from 'formik'
import { ScrollView, View, Pressable, StyleSheet } from 'react-native'
import * as yup from 'yup'
import { create } from '../../api/RestaurantCategoryEndpoints'
import { getRestaurantCategories } from '../../api/RestaurantEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import InputItem from '../../components/InputItem'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'
import CreateRestaurantScreen from './CreateRestaurantScreen'

export default function CreateCategoryScreen ({ navigation, route }) {
  const initialCategoryValues = { name: null, createdAt: null }
  const [backendErrors, setBackendErrors] = useState([])

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required')
  })

  const createCategory = async (values) => {
    try {
      const createdCategory = await create(values)
      showMessage({
        message: `Category ${createdCategory.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('CreateRestaurantScreen', { dirty: true })
    } catch (err) {
      showMessage({
        message: 'That name is already in use',
        type: 'warning',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      console.log(err)
      setBackendErrors(err)
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialCategoryValues}
      onSubmit={createCategory}>
        {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Save category
                </TextRegular>
              </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
