import { Request, Response } from "express";
import { CreateAnnouncementDto, CustomError, PaginationDto } from "../../domain";
import { AnnouncementService } from "../services/announcement.service";
import { RequestFormService } from "../services";
import { CreateRequestFormDto } from "../../domain/dtos/request-form/create-request-form.dto";
import { CreateAnswerFormDto } from "../../domain/dtos/request-form/create-answer-form.dto";

export class RequestFormController {

  // DI
  constructor(
    private readonly requestFormService: RequestFormService
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.StatusCode).json({ error: error.message });
    }

    console.error(`${error}`);
    return res.status(500).json({ error: 'Error Interno del Servidor' });
  }

  getRequestForms = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.requestFormService.getRequestForms(paginationDto!)
      .then((requestForms) => res.json(requestForms))
      .catch((error) => this.handleError(error, res));
  }

  getRequestForm = (req: Request, res: Response) => {
    const { id } = req.params;

    this.requestFormService.getRequestForm(id)
      .then((request) => {
        return res.json(request);
      })
      .catch((error) => this.handleError(error, res));
  }

  createRequestForm = (req: Request, res: Response) => {
    const [error, createRequestFormDto] = CreateRequestFormDto.create(req.body);


    if (error) return res.status(400).json({ error });

    this.requestFormService.createRequestForm(createRequestFormDto!)
      .then((request) => res.json(request))
      .catch((error) => this.handleError(error, res));
  }

  createAnswer = (req: Request, res: Response) => {
    const [error, createAnswerFormDto] = CreateAnswerFormDto.create(req.body);


    if (error) return res.status(400).json({ error });

    this.requestFormService.createAnswerForm(createAnswerFormDto!, req.body.user)
      .then((request) => res.json(request))
      .catch((error) => this.handleError(error, res));
  }




}