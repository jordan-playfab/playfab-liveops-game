import React from "react";

export interface IWithPageProps {
    readonly errorMessage: string;
    readonly clearErrorMessage: () => void;
    readonly onPlayFabError: (errorMessage: string) => void;
}

interface IState {
    errorMessage: string;
}

export const withPage = <P extends IWithPageProps>(Component: React.ComponentType<P>) => {
    return class WithAppState extends React.Component<Omit<P, keyof IWithPageProps>, IState> {
        public state: IState = {
			errorMessage: null,
		};

        public render(): React.ReactNode {
            return (
                <Component
                    {...this.props as P}
                    errorMessage={this.state.errorMessage}
                    onPlayFabError={this.onPlayFabError}
                    clearErrorMessage={this.clearErrorMessage}
                />
            );
        }

        private onPlayFabError = (errorMessage: string): void => {
            this.setState({
                errorMessage,
            });
        }

        private clearErrorMessage = (): void => {
            this.setState({
                errorMessage: null,
            });
        }
    }
}