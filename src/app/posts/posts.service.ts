import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from 'rxjs';
import { Post } from "./post.model";
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(public http: HttpClient, private router: Router) {}

  getPosts() {
    //return [...this.posts];
    this.http.get<{message: string, posts: any[]}>('http://localhost:3000/api/posts')
             .pipe(map((postData) => {
                return postData.posts.map(post => {
                  return {
                    id: post._id,
                    title: post.title,
                    content: post.content
                  }
                })
             }))
             .subscribe((postData) => {
                console.log('Check data, ');
                console.log(postData);
                this.posts = postData;
                this.postsUpdated.next([...this.posts]);
             });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/"+id);
    //return {...this.posts.find(p => p.id === id)};
  }

  addPost(ptitle: string, pcontent: string) {
    const post: Post = {
      title: ptitle,
      content: pcontent
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
             .subscribe((resp) => {
                console.log(resp.message);
                const id = resp.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
             });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http
        .put("http://localhost:3000/api/posts/"+id, post)
        .subscribe(response => {
          const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
          updatedPosts[oldPostIndex] = post;
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
          this.router.navigate(['/']);
        });
  }

  delete(postId: any) {
    this.http.delete<{message: string}>('http://localhost:3000/api/posts/'+postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
        console.log('Deleted.')
      })
  }


}
