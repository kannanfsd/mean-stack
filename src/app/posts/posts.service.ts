import { HttpClient } from "@angular/common/http";
import { Content } from "@angular/compiler/src/render3/r3_ast";
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
                    content: post.content,
                    imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
      "http://localhost:3000/api/posts/"+id);
    //return {...this.posts.find(p => p.id === id)};
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {
    //   title: ptitle,
    //   content: pcontent
    // };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title)
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
             .subscribe((responseData) => {
                const post: Post = {
                  id: responseData.post.id,
                  title: title,
                  content: content,
                  imagePath: responseData.post.imagePath
                }
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
             });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image
        }
    }
    this.http
        .put("http://localhost:3000/api/posts/"+id, postData)
        .subscribe(response => {
          const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
          const post: Post = {
            id: id,
            title: title,
            content: content,
            imagePath: ""
          }
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
