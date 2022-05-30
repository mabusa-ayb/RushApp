import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { IBlogPost } from 'src/app/Interfaces/blog-post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user$ = this.authService.currentUser$

  loadedPosts: IBlogPost[] = [];

  isFetching = false;

  url: string = 'https://rush-app-2b421-default-rtdb.firebaseio.com/post.json';

  constructor(private authService: AuthenticationService, private http: HttpClient, private toast: HotToastService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  onCreatePost(postData: {title: string; content: string}){
    this.http.post(this.url, postData).pipe(
      this.toast.observe({
        success: 'Post saved Successfully!',
        loading: 'Saving ...',
        error: 'There was an error!'
      })
    )
  .subscribe(responseData => {
    console.log(responseData);
    this.getPosts();
    });
  }

  getPosts(){
        this.http
        .get(this.url)
        .pipe(
          map((responseData:any) => {
            const postsArray = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          })
        )
        .subscribe(posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        });
    }
    
}
