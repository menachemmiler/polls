import mongoose from 'mongoose';
import { DocumentNotFoundError } from '../../utils/errors';
import { IPollSection, PollDocument, PollSectionDocument } from './interface';
import { PollModel } from './model';

export class PollsManager {
    static getAll = async (): Promise<PollDocument[]> => {
        return PollModel.find().lean().exec();
  };
  
  static getAllByIds = async (pollIds: string[]): Promise<PollDocument[]> => {
    return PollModel.find({ _id: { $in: pollIds } }).lean().exec();
  };
  
    static getOneById = async (pollId: string, populate: boolean): Promise<PollDocument> => {
        const data = PollModel.findOne({ _id: pollId }).orFail(new DocumentNotFoundError(pollId));
      
        if (populate) {
          data.populate({
            path: 'sections.questions',
            model: 'questions',
          });
        }
      
        return data.lean().exec();
      };
      
   
    static createOne = async (poll: Partial<PollDocument>): Promise<PollDocument> => {
        return PollModel.create({title: poll.name, ...poll});
    };

    static updateOne = async (pollId: string, poll: Partial<PollDocument>): Promise<PollDocument> => {
        return PollModel.findByIdAndUpdate(pollId, poll, { new: true }).orFail(new DocumentNotFoundError(pollId)).lean().exec();
    };

static updateSections = async (
    pollId: string, 
    sectionId: string, 
    sectionData: Partial<IPollSection>
): Promise<PollDocument> => {
    const updateFields: any = {};
    if (sectionData.title !== undefined) {
        updateFields["sections.$.title"] = sectionData.title;
    }
    if (sectionData.description !== undefined) {
        updateFields["sections.$.description"] = sectionData.description;
    }

    return PollModel.findOneAndUpdate(
        { 
            _id: pollId,
            "sections._id": sectionId
        },
        { $set: updateFields },
        { new: true }
    ).orFail(new DocumentNotFoundError(`Poll: ${pollId}, Section: ${sectionId}`))
    .lean()
    .exec();
};

    static deleteOne = async (pollId: string): Promise<PollDocument> => {
        return PollModel.findByIdAndDelete(pollId).orFail(new DocumentNotFoundError(pollId)).lean().exec();
  };
  

static updateAddQuestion = async ({
  pollId,
  sectionId,
  questionId,
  index,
}: {
  pollId: string;
  sectionId: string;
  questionId: string;
  index: number;
}) => {
  const poll = await PollModel.findOne({
    _id: pollId,
    'sections._id': sectionId,
  }).lean();

  if (!poll) {
    throw new DocumentNotFoundError(pollId);
  }

  const section = poll.sections?.find(
    (s: any) => s._id.toString() === sectionId
  );

  if (!section) {
    throw new Error('Section not found');
  }

  const safeIndex = Math.max(
    0,
    Math.min(index, section.questions.length)
  );

  section.questions.splice(
    safeIndex,
    0,
    questionId
  );

  await PollModel.updateOne(
    { _id: pollId, 'sections._id': sectionId },
    {
      $set: {
        'sections.$.questions': section.questions,
      },
    }
  );
};
static reorderQuestion = async (pollId:string, { sectionId, questionId, index }: {   sectionId: string, questionId: string, index: number }) => {
  const poll = await PollModel.findOne({ _id: pollId }, { sections: 1 }).orFail(new DocumentNotFoundError(pollId)).exec();

  const section = (poll.sections as PollSectionDocument[])!.find(s => s._id.toString() === sectionId);
  if (!section) throw new Error("Section not found");

  section.questions = section.questions.filter(qId => qId.toString() !== questionId);

  const safeIndex = Math.max(0, Math.min(index, section.questions.length));

  section.questions.splice(safeIndex, 0, questionId);

  await PollModel.updateOne(
    { _id: pollId, "sections._id": sectionId },
    { $set: { "sections.$.questions": section.questions } }
  );
};

static reorderSections = async (pollId: string, { sectionId, index }: { sectionId: string, index: number }) => {
 const poll = await PollModel.findOne({ _id: pollId }, { sections: 1 }).orFail(new DocumentNotFoundError(pollId)).exec();

 const sections = poll.sections as PollSectionDocument[];
 
 const currentIndex = sections.findIndex(s => s._id.toString() === sectionId);
 if (currentIndex === -1) throw new Error("Section not found");

 const [movedSection] = sections.splice(currentIndex, 1);
 const safeIndex = Math.max(0, Math.min(index, sections.length));
 sections.splice(safeIndex, 0, movedSection);

 await PollModel.updateOne(
   { _id: pollId },
   { $set: { sections: sections } }
 );
};

static copySection = async (pollId: string, sectionId: string) => {
  const poll = await PollModel.findById(pollId);
  
  if (!poll || !poll.sections) throw new Error("Poll or sections not found");
  
  const sections = poll.sections as PollSectionDocument[];
  const sectionIndex = sections.findIndex(s => s._id.toString() === sectionId);
  
  if (sectionIndex === -1) throw new Error("Section not found");
  
  const sectionToCopy = sections[sectionIndex];
  
  const newSection = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: `${sectionToCopy.title}`,
    description: sectionToCopy.description,
    questions: [...sectionToCopy.questions] 
  };
  
  sections.splice(sectionIndex + 1, 0, newSection);
  
  await PollModel.updateOne(
    { _id: pollId },
    { $set: { sections: sections } }
  );
  
  return PollModel.findById(pollId);
};

static deleteQuestion = async ({pollId, sectionId, questionId }: {pollId: string, sectionId: string, questionId: string }) => {
    return PollModel.updateOne(
     {
     _id: pollId,
     "sections._id": sectionId
     },
     {
     $pull: {
     "sections.$.questions": questionId
     }
     }
    ).orFail(new DocumentNotFoundError(pollId));;
  };

    
    static addSection = async (pollId: string): Promise<PollDocument> => {
    return PollModel.findByIdAndUpdate(
        pollId,
        { $push: { sections: { questions: [] } } },
        { new: true }
    ).orFail(new DocumentNotFoundError(pollId)).lean().exec();
};


static deleteSection = async (pollId: string, sectionId: string): Promise<PollDocument> => {
    return PollModel.findByIdAndUpdate(
        pollId,
        { $pull: { sections: { _id: new mongoose.Types.ObjectId(sectionId) } } },
        { new: true }
    ).orFail(new DocumentNotFoundError(pollId)).lean().exec();
};


  
}



