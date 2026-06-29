package com.readbridge.app.ui.navigation

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.readbridge.app.ui.screens.*
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@Composable
fun NavGraph(
    navController: NavHostController,
    viewModel: ReadBridgeViewModel,
    paddingValues: PaddingValues
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Auth.route,
        modifier = Modifier.padding(paddingValues)
    ) {
        composable(Screen.Auth.route) {
            AuthScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Auth.route) { inclusive = true }
                    }
                }
            )
        }
        composable(Screen.Home.route) {
            DashboardScreen(
                viewModel = viewModel,
                onNavigateToMarketplace = { navController.navigate(Screen.Marketplace.route) },
                onNavigateToCommunity = { navController.navigate(Screen.Community.route) }
            )
        }
        composable(Screen.Marketplace.route) {
            MarketplaceScreen(viewModel = viewModel)
        }
        composable(Screen.Cart.route) {
            CartScreen(viewModel = viewModel)
        }
        composable(Screen.Community.route) {
            CommunityScreen(viewModel = viewModel)
        }
        composable(Screen.Profile.route) {
            ProfileScreen(
                viewModel = viewModel,
                onLogout = {
                    viewModel.logout()
                    navController.navigate(Screen.Auth.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
