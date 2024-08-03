import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Rating, Header } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import store, { addToCart, incrementQuantity, decrementQuantity } from './store';

const Stack = createStackNavigator();

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  const renderProduct = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              imageSize={20}
              readonly
              startingValue={item.rating.rate}
              style={styles.rating}
            />
            <Text style={styles.ratingCount}>({item.rating.count})</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      {/* <Header
        centerComponent={{ text: 'Product List', style: { color: '#fff', fontSize: 18 } }}
        containerStyle={{
          backgroundColor: '#4CAF50',
          justifyContent: 'space-around',
          paddingTop: getStatusBarHeight(),
          height: 60 + getStatusBarHeight(),
        }}
      /> */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(cart.find(item => item.id === product.id)?.quantity || 1);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <Header
        leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => navigation.goBack() }}
        centerComponent={{ text: 'Product Details', style: { color: '#fff', fontSize: 18 } }}
        containerStyle={{
          backgroundColor: '#4CAF50',
          justifyContent: 'space-around',
          paddingTop: getStatusBarHeight(),
          height: 60 + getStatusBarHeight(),
        }}
      />
      <View style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              imageSize={20}
              readonly
              startingValue={product.rating.rate}
              style={styles.rating}
            />
            <Text style={styles.ratingCount}>({product.rating.count})</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          {cart.find(item => item.id === product.id) && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={handleDecrementQuantity}>
                <Text style={styles.controlButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrementQuantity}>
                <Text style={styles.controlButton}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ProductList" component={ProductList}/>
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  productLst: {
    backgroundColor:'blue',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  category: {
    fontSize: 14,
    color: '#aaa',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    alignSelf: 'flex-start',
  },
  ratingCount: {
    marginLeft: 5,
    fontSize: 14,
    color: '#888',
  },
  description: {
    marginVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#4CAF50',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
  },
});

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
