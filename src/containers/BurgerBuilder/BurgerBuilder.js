import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios.orders'


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.6,
    meat: 1.3,
    bacon: 0.7
};
class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
      axios.get('https://burgerburger-4f1b9.firebaseio.com/ingredients.json')
        .then(response => {
          this.setState({ingredients: response.data})
        })
          .catch(error => {
            this.setState({error: true})
          });
    }
    

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
            this.setState({purchasable: sum > 0})
    };
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});  
    // }
    addIngredientHandler = type => {
        const updatedIngredients = { ...this.state.ingredients };
        updatedIngredients[type] = updatedIngredients[type] + 1;
        this.updatePurchaseState(updatedIngredients);
        this.setState((prevState, props) => {
          return {
            ingredients: updatedIngredients,
            totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type]
          };
        });
      };

      removeIngredientHandler = type => {
        if (this.state.ingredients[type] <= 0) {
          return;
        }
        
     
        const updatedIngredients = { ...this.state.ingredients };
        updatedIngredients[type] = updatedIngredients[type] - 1;
        this.updatePurchaseState(updatedIngredients);
        this.setState((prevState, props) => {
          return {
            ingredients: updatedIngredients,
            totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type],
          };
        });
      };

      purchaseHandler = () => {
        this.setState({purchasing: true});
      }

      purchaseCancelHandler = () => {
        this.setState({purchasing: false});
      }
      purchaseContinueHandler = () => {
        //alert('You wil be keep going!');
        this.setState({loading: true});
        const order = {
          ingredients: this.state.ingredients,
          price: this.state.totalPrice,
          customer: {
            name: 'Jakub Antczak',
            address: {
              street: 'Teststreet 1',
              zipCode: '65-001',
              country: 'Poland'
            },
            email: 'test@tesrt.com'
          },
          deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
          .then(response => {
            this.setState({loading: false, purchasing: false});
          })
          .catch(error => {
            this.setState({loading: false, purchasing: false});
          });
      }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = <Spinner />;
        
        if (this.state.ingredients) {
          burger = (
          <Aux>
            <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                />
          </Aux>
          ),
          orderSummary = <OrderSummary
          ingredients={this.state.ingredients}
          price = {this.state.totalPrice}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          />
          }
          if(this.state.loading) {
            orderSummary = <Spinner />;
          

        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
                </Modal> 
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);