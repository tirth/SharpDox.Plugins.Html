import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {ContentBase} from '../ContentBase';
import {StateService} from '../state/StateService';
import {SiteStateChanger} from '../state/SiteStateChanger';

@Component({
    selector: 'sd-article',
    templateUrl: '/templates/content/article/article.html',
    styleUrls: ['./templates/content/article/article.css']
})
export class ArticleComponent extends ContentBase { 
           
    private _subscriberId : number;
           
    public currentPageData : any = {};
    public disqusShortName : string;
    
    constructor(private _routeParams : RouteParams, 
                private _stateService : StateService,
                private _siteStateChanger : SiteStateChanger){ 
        super("sd-article");
        this.disqusShortName = sharpDox.projectData.disqusShortName;
        this._subscriberId = this._stateService.stateContainer.registerSubscriber(this);
    }
    
    notify(state){
        this.currentPageData = state.get("SiteStateChanger.currentPageData");
    }
    
    ngOnInit(){        
        let id = this._routeParams.get('id');
        this._siteStateChanger.setCurrentPageToArticle(id);     
    }
    
    ngOnDestory(){
        this._stateService.stateContainer.unregisterSubscriber(this._subscriberId);
    }
    
}