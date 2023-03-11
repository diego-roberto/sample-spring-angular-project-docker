import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class VideoService {
    private endpointYoutube = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=';
    private apiKeyYoutube = 'AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw';

    private endpointVimeo = 'http://vimeo.com/api/v2/video/';

    constructor(private http: Http ) { }

    getYoutubeInfo(video: string) {
         return this.http.get(this.endpointYoutube +  video + '&key=' + this.apiKeyYoutube).map(
            (res: Response) => res.json());
    }

    getVimeoInfo(video:string){
        return this.http.get(this.endpointVimeo +  video + '/json').map(
            (res: Response) => res.json());
    }

    getVideoType(url: string) {
        url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        if (RegExp.$3.indexOf('youtu') > -1) {
            var type = 'youtube';
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            var type = 'vimeo';
        }
        return type;
    }

    getVideoId(url: string) {
        url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
        return RegExp.$6;
    }
}
