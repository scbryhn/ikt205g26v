package com.scbryhn.fastnoteskotlin

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun FastNotesApp() {
    val navController = rememberNavController()
    val notes = remember { mutableStateListOf<Note>() }

    NavHost(
        navController = navController,
        startDestination = "main"
    ) {
        composable("main") {
            MainScreen(navController, notes)
        }

        composable("new") {
            NewNoteScreen(navController, notes)
        }

        composable("detail/{noteId}") { backStackEntry ->
            val id = backStackEntry.arguments?.getString("noteId")?.toInt()
            val note = notes.find { it.id == id }
            note?.let {
                DetailScreen(navController, it)
            }
        }
    }
}