package com.readbridge.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.width
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.readbridge.app.data.local.AppDatabase
import com.readbridge.app.data.repository.ReadBridgeRepository
import com.readbridge.app.ui.navigation.NavGraph
import com.readbridge.app.ui.navigation.Screen
import com.readbridge.app.ui.theme.ReadBridgeTheme
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val database = remember { AppDatabase.getDatabase(applicationContext) }
            val repository = remember {
                ReadBridgeRepository(
                    bookDao = database.bookDao(),
                    cartDao = database.cartDao(),
                    clubDao = database.clubDao(),
                    postDao = database.postDao()
                )
            }
            
            val viewModel: ReadBridgeViewModel = viewModel(
                factory = object : ViewModelProvider.Factory {
                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                        return ReadBridgeViewModel(repository) as T
                    }
                }
            )

            val isDarkTheme by viewModel.isDarkTheme.collectAsState()

            ReadBridgeTheme(darkTheme = isDarkTheme) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainAppScaffold(viewModel)
                }
            }
        }
    }
}

@Composable
fun MainAppScaffold(viewModel: ReadBridgeViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val configuration = LocalConfiguration.current
    val isTablet = configuration.screenWidthDp >= 600

    val navigationItems = listOf(
        Screen.Home,
        Screen.Marketplace,
        Screen.Cart,
        Screen.Community,
        Screen.Profile
    )

    val showNavigation = currentRoute != Screen.Auth.route && currentRoute != null

    if (isTablet && showNavigation) {
        Row(modifier = Modifier.fillMaxSize()) {
            NavigationRail(
                modifier = Modifier.fillMaxHeight().width(80.dp),
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.onSurfaceVariant
            ) {
                navigationItems.forEach { item ->
                    NavigationRailItem(
                        icon = { Icon(item.icon!!, contentDescription = item.title) },
                        label = { Text(item.title, style = MaterialTheme.typography.labelSmall) },
                        selected = currentRoute == item.route,
                        onClick = {
                            if (currentRoute != item.route) {
                                navController.navigate(item.route) {
                                    popUpTo(Screen.Home.route) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        }
                    )
                }
            }
            Scaffold { paddingValues ->
                NavGraph(
                    navController = navController,
                    viewModel = viewModel,
                    paddingValues = paddingValues
                )
            }
        }
    } else {
        Scaffold(
            bottomBar = {
                if (showNavigation) {
                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        navigationItems.forEach { item ->
                            NavigationBarItem(
                                icon = { Icon(item.icon!!, contentDescription = item.title) },
                                label = { Text(item.title, style = MaterialTheme.typography.labelSmall) },
                                selected = currentRoute == item.route,
                                onClick = {
                                    if (currentRoute != item.route) {
                                        navController.navigate(item.route) {
                                            popUpTo(Screen.Home.route) { saveState = true }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            }
        ) { paddingValues ->
            NavGraph(
                navController = navController,
                viewModel = viewModel,
                paddingValues = paddingValues
            )
        }
    }
}
