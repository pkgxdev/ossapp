FROM ubuntu:22.04

RUN apt-get update

# TEMPORARY: until the ff packages are packaged in tea
RUN apt-get install -y libgtk-3-dev webkit2gtk-4.0 libappindicator3-dev librsvg2-dev patchelf pkg-config
RUN apt-get install -y curl
RUN curl https://tea.xyz -o tea.sh && chmod +x tea.sh
RUN ./tea.sh --yes

COPY ./entrypoint.sh ./entrypoint.sh
ENTRYPOINT sh ./entrypoint.sh

CMD ["bash"]