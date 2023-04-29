import { Component } from 'react';
import { ImSearch } from 'react-icons/im';
import { toast } from 'react-toastify';
import css from './Searchbar.module.css';

export class Searchbar extends Component {
  state = {
    imageName: '',
  };

  onChangeInput = evt => {
    const { name, value } = evt.currentTarget;
    this.setState({ [name]: value });
  };

  resetForm = () => {
    this.setState({ imageName: '' });
  };

  render() {
    return (
      <header className={css.searchbar}>
        <form
          onSubmit={evt => {
            evt.preventDefault();

            if (!this.state.imageName) {
              return toast.error('Enter text for search.');
            }

            this.props.handleSubmit(this.state.imageName);
            this.resetForm();
          }}
          className={css.form}
        >
          <button type="submit" className={css.button}>
            <ImSearch size="20" />
          </button>

          <input
            value={this.state.imageName}
            onChange={this.onChangeInput}
            className={css.input}
            name="imageName"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
