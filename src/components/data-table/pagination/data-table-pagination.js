import { LitElement, html, css } from "lit";

class DataTablePagination extends LitElement{

    static styles = css`
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
        }
        
        .page-btn.active {
            background-color: #FF6200;
            color:#FFEDE3;
            font-family: var(--font-medium);
            font-size: .8rem;
        }
        .page-btn {
            background: none;
            color: #4B4B4B;
            font-family: var(--font-regular);
            font-size: .7rem;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            user-select: none;
        }
        .pagination span {
            font-size: 1rem;
            color: #666;
        }
        .pagination .arrow-btn{
            cursor:pointer;
            user-select: none;
        }
        .pagination .arrow-btn.active{
            color:#FF6200;
        }
        .pagination .arrow-btn.disabled{
            cursor: not-allowed;
        }
        @media (max-width: 768px) {
            .pagination {
                justify-content: center;
            }
            .page-btn {
                padding: 0.4rem 0.8rem;
            }
        }
        @media (max-width: 480px) {
            .pagination {
                flex-wrap: wrap;
                gap: 0.3rem;
            }
        }
    `;

    static properties = {
        currentPage : { type: Number },
        totalCount : { type: Number },
        itemCount : { type: Number },
        totalPage : { type: Number}
    }

    constructor(){
        super();
        this.currentPage = 1;
        this.totalCount = 1;
        this.itemCount = 1;
        this.totalPage = 1;
        
    }

    changePage(newPage) {
        if (newPage > 0 && newPage <= this.totalPage && newPage !== this.currentPage) {
            this.currentPage = newPage;
            const paginationChangeEvent = new CustomEvent('pagination-component-changed', {
                detail : {'status' : 'page_change', 'data' : newPage},
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(paginationChangeEvent);
        }
    }


    render(){
        const visiblePages = 5;
        const startPage = Math.max(this.currentPage - Math.floor(visiblePages / 2), 1);
        const endPage = Math.min(startPage + visiblePages - 1, this.totalPage);

        return this.totalCount > 0 ? html`
                <div class="pagination">
                    <div class="arrow-btn ${this.currentPage > 1 ? 'active' : 'disabled'}" @click="${() => this.changePage(this.currentPage - 1)}">
                        <
                    </div>
                    ${ Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => {
                        return html`<button class="page-btn ${this.currentPage === page ? 'active' : ''}" @click="${() => this.changePage(page) }">${page}</button>`
                    })}
                    ${this.currentPage < this.totalPage - 3 && this.totalPage > 6 ? html`<span>...</span>`: html``}
    
                    ${this.currentPage + 2 < this.totalPage ? html`<button class="page-btn" @click="${() => this.changePage(this.totalPage) }">${this.totalPage}</button> `: html``}
                    <div class="arrow-btn ${this.currentPage < this.totalPage ? 'active' : 'disabled'}" @click="${() => this.changePage(this.currentPage + 1)}">
                        >
                    </div>
                  </div>
        ` : ''
    }
}

customElements.define('data-table-pagination', DataTablePagination);