package com.readbridge.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.Comment
import androidx.compose.material.icons.filled.Group
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.readbridge.app.data.model.Club
import com.readbridge.app.data.model.Post
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@Composable
fun CommunityScreen(viewModel: ReadBridgeViewModel) {
    val clubs by viewModel.clubs.collectAsState()
    var selectedClub by remember { mutableStateOf<Club?>(null) }
    var showCreatePostDialog by remember { mutableStateOf(false) }

    LaunchedEffect(clubs) {
        if (selectedClub == null && clubs.isNotEmpty()) {
            selectedClub = clubs.first()
        }
    }

    Scaffold(
        floatingActionButton = {
            if (selectedClub != null) {
                FloatingActionButton(
                    onClick = { showCreatePostDialog = true },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Tambah Diskusi")
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text(
                text = "Klub Buku & Forum Diskusi",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            ScrollableTabRow(
                selectedTabIndex = clubs.indexOf(selectedClub).coerceAtLeast(0),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                edgePadding = 0.dp
            ) {
                clubs.forEach { club ->
                    Tab(
                        selected = selectedClub == club,
                        onClick = { selectedClub = club },
                        text = { Text(club.name) }
                    )
                }
            }

            selectedClub?.let { club ->
                OutlinedCard(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                    colors = CardDefaults.outlinedCardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Group, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(20.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = club.description, fontSize = 12.sp, lineHeight = 16.sp)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(text = "${club.memberCount} Anggota", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                val postsFlow = remember(club.id) { viewModel.getPostsForClub(club.id) }
                val posts by postsFlow.collectAsState(initial = emptyList())

                if (posts.isEmpty()) {
                    Box(modifier = Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                        Text(text = "Belum ada diskusi. Jadilah yang pertama memulai!", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(posts) { post ->
                            PostRow(
                                post = post,
                                onUpvote = { viewModel.upvotePost(post) },
                                onDownvote = { viewModel.downvotePost(post) }
                            )
                        }
                    }
                }
            }
        }
    }

    if (showCreatePostDialog) {
        var postTitle by remember { mutableStateOf("") }
        var postContent by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showCreatePostDialog = false },
            confirmButton = {
                Button(
                    onClick = {
                        if (postTitle.isNotBlank() && postContent.isNotBlank() && selectedClub != null) {
                            viewModel.createPost(selectedClub!!.id, postTitle, postContent)
                            showCreatePostDialog = false
                        }
                    }
                ) {
                    Text("Kirim Post")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreatePostDialog = false }) {
                    Text("Batal")
                }
            },
            title = {
                Text("Mulai Diskusi Baru", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = postTitle,
                        onValueChange = { postTitle = it },
                        label = { Text("Judul Diskusi") },
                        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = postContent,
                        onValueChange = { postContent = it },
                        label = { Text("Isi Diskusi") },
                        modifier = Modifier.fillMaxWidth().height(120.dp),
                        maxLines = 5
                    )
                }
            }
        )
    }
}

@Composable
fun PostRow(
    post: Post,
    onUpvote: () -> Unit,
    onDownvote: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.padding(end = 12.dp)
            ) {
                IconButton(onClick = onUpvote, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.ArrowUpward, contentDescription = "Upvote", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                }
                Text(
                    text = "${post.votes}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                IconButton(onClick = onDownvote, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.ArrowDownward, contentDescription = "Downvote", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(20.dp))
                }
            }

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = post.author, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                    Text(text = post.timestamp, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = post.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(bottom = 4.dp))
                Text(text = post.content, fontSize = 12.sp, lineHeight = 16.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Comment, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "${post.commentCount} komentar", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}
